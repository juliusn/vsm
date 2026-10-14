-- Keep PostGIS outside the public Data API schema without dropping geometry data.
-- Run this migration in a transaction: all changes must succeed or roll back.
DO $migration$
DECLARE
  extension_schema text;
  extension_version text;
BEGIN
  SELECT n.nspname, e.extversion INTO extension_schema, extension_version
  FROM pg_extension e JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE e.extname = 'postgis';

  IF extension_schema = 'extensions' THEN
    RETURN;
  END IF;
  IF extension_schema IS DISTINCT FROM 'public' THEN
    RAISE EXCEPTION 'Expected PostGIS in public, found %', extension_schema;
  END IF;

  LOCK TABLE public.port_areas IN ACCESS EXCLUSIVE MODE;
  CREATE TEMP TABLE postgis_geometry_backup ON COMMIT DROP AS
    SELECT port_area_code, locode, public.ST_AsEWKB(geometry) AS ewkb
    FROM public.port_areas;
  CREATE TEMP TABLE postgis_reference_backup ON COMMIT DROP AS
    SELECT * FROM public.spatial_ref_sys;

  -- EWKB preserves coordinates, dimensions and SRIDs, including null geometries.
  ALTER TABLE public.port_areas ALTER COLUMN geometry TYPE text
    USING encode(public.ST_AsEWKB(geometry), 'hex');

  -- RESTRICT intentionally fails if an unhandled dependency remains.
  DROP EXTENSION postgis RESTRICT;
  CREATE SCHEMA IF NOT EXISTS extensions;
  EXECUTE format('CREATE EXTENSION postgis WITH SCHEMA extensions VERSION %L', extension_version);

  INSERT INTO extensions.spatial_ref_sys
    SELECT * FROM postgis_reference_backup
    ON CONFLICT (srid) DO UPDATE SET
      auth_name = EXCLUDED.auth_name,
      auth_srid = EXCLUDED.auth_srid,
      srtext = EXCLUDED.srtext,
      proj4text = EXCLUDED.proj4text;

  ALTER TABLE public.port_areas ALTER COLUMN geometry TYPE extensions.geometry
    USING extensions.ST_GeomFromEWKB(decode(geometry, 'hex'));

  IF EXISTS (
    SELECT 1 FROM public.port_areas p
    FULL JOIN postgis_geometry_backup b USING (port_area_code, locode)
    WHERE p.port_area_code IS NULL OR b.port_area_code IS NULL
      OR extensions.ST_AsEWKB(p.geometry) IS DISTINCT FROM b.ewkb
  ) THEN
    RAISE EXCEPTION 'Geometry verification failed; rolling back PostGIS relocation';
  END IF;

  REVOKE ALL ON extensions.spatial_ref_sys FROM anon, authenticated;
END;
$migration$;

NOTIFY pgrst, 'reload schema';
