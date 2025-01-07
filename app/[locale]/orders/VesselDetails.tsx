'use client';

import { Table } from '@mantine/core';
import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from 'next-intl';

interface Eta {
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const updatedFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const etaFormatOptions: DateTimeFormatOptions = {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export function VesselDetails({ vessel }: { vessel: AppTypes.Vessel }) {
  const t = useTranslations('VesselDetails');
  const format = useFormatter();
  const eta = parseEta(vessel.eta);
  const etaLabel = eta
    ? format.dateTime(
        new Date(Date.UTC(1970, eta.month - 1, eta.day, eta.hour, eta.minute)),
        etaFormatOptions
      )
    : t('notAvailable');
  const shipTypeKey = parseShipTypeKey(vessel.shipType);
  const mid = Number(vessel.mmsi.toString().slice(0, 3));
  const midLocale = midToLocale[mid];

  return (
    <Table captionSide="top" variant="vertical">
      <Table.Caption>{t('caption')}</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t('name')}</Table.Th>
          <Table.Td>{vessel.name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('timestamp')}</Table.Th>
          <Table.Td>
            {format.dateTime(new Date(vessel.timestamp), updatedFormatOptions)}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('destination')}</Table.Th>
          <Table.Td>{vessel.destination}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('shipType')}</Table.Th>
          <Table.Td>{`${vessel.shipType}: ${t(`shipTypes.${shipTypeKey}`)}`}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('mmsi')}</Table.Th>
          <Table.Td>
            {vessel.mmsi} {midLocale ? `(${midLocale})` : ''}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('callSign')}</Table.Th>
          <Table.Td>{vessel.callSign}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('imo')}</Table.Th>
          <Table.Td>{vessel.imo}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('draught')}</Table.Th>
          <Table.Td>
            {format.number(vessel.draught / 10, {
              style: 'unit',
              unit: 'meter',
            })}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('eta')}</Table.Th>
          <Table.Td>{etaLabel}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}

function parseShipTypeKey(typeCode: number): string {
  if (typeCode === 0) return 'notAvailable';

  if (typeCode >= 1 && typeCode <= 19) return 'reservedForFutureUse';

  if (typeCode >= 20 && typeCode <= 29) return 'wig';

  if (typeCode >= 30 && typeCode <= 39) {
    const specificKeys: Record<number, string> = {
      31: 'towing',
      32: 'towingLarge',
      33: 'dredgingOrUnderwaterOps',
      34: 'divingOps',
      35: 'militaryOps',
      36: 'sailing',
      37: 'pleasureCraft',
    };
    return specificKeys[typeCode] || 'otherType30Series';
  }

  if (typeCode >= 40 && typeCode <= 49) return 'hsc';

  if (typeCode >= 50 && typeCode <= 59) {
    const specificKeys: Record<number, string> = {
      50: 'pilotVessel',
      51: 'searchAndRescue',
      52: 'tug',
      53: 'portTender',
      54: 'antiPollutionEquipment',
      55: 'lawEnforcement',
    };
    return specificKeys[typeCode] || 'otherType50Series';
  }

  if (typeCode >= 60 && typeCode <= 69) return 'passengerShip';

  if (typeCode >= 70 && typeCode <= 79) return 'cargoShip';

  if (typeCode >= 80 && typeCode <= 89) return 'tanker';

  if (typeCode >= 90 && typeCode <= 99) return 'otherShip';

  if (typeCode > 99) return 'reservedForFutureUse';

  return 'unknownType';
}

function parseEta(encodedEta: number): Eta | null {
  const month = (encodedEta >> 16) & 0x0f;
  const day = (encodedEta >> 11) & 0x1f;
  const hour = (encodedEta >> 6) & 0x1f;
  const minute = encodedEta & 0x3f;

  if (month === 0 || day === 0 || hour === 24 || minute === 60) {
    return null;
  }

  return { month, day, hour, minute };
}

const midToLocale: Record<number, string> = {
  201: 'AL', // Albania
  202: 'AD', // Andorra
  203: 'AT', // Austria
  204: 'PT', // Portugal (Azores)
  205: 'BE', // Belgium
  206: 'BY', // Belarus
  207: 'BG', // Bulgaria
  208: 'VA', // Vatican City
  209: 'CY', // Cyprus
  210: 'CY', // Cyprus
  211: 'DE', // Germany
  212: 'CY', // Cyprus
  213: 'GE', // Georgia
  214: 'MD', // Moldova
  215: 'MT', // Malta
  216: 'AM', // Armenia
  218: 'DE', // Germany
  219: 'DK', // Denmark
  220: 'DK', // Denmark
  224: 'ES', // Spain
  225: 'ES', // Spain
  226: 'FR', // France
  227: 'FR', // France
  228: 'FR', // France
  229: 'MT', // Malta
  230: 'FI', // Finland
  231: 'DK', // Denmark (Faroe Islands)
  232: 'GB', // United Kingdom
  233: 'GB', // United Kingdom
  234: 'GB', // United Kingdom
  235: 'GB', // United Kingdom
  236: 'GI', // Gibraltar
  237: 'GR', // Greece
  238: 'HR', // Croatia
  239: 'GR', // Greece
  240: 'GR', // Greece
  241: 'GR', // Greece
  242: 'MA', // Morocco
  243: 'HU', // Hungary
  244: 'NL', // Netherlands
  245: 'NL', // Netherlands
  246: 'NL', // Netherlands
  247: 'IT', // Italy
  248: 'MT', // Malta
  249: 'MT', // Malta
  250: 'IE', // Ireland
  251: 'IS', // Iceland
  252: 'LI', // Liechtenstein
  253: 'LU', // Luxembourg
  254: 'MC', // Monaco
  255: 'PT', // Portugal (Madeira)
  256: 'MT', // Malta
  257: 'NO', // Norway
  258: 'NO', // Norway
  259: 'NO', // Norway
  261: 'PL', // Poland
  262: 'ME', // Montenegro
  263: 'PT', // Portugal
  264: 'RO', // Romania
  265: 'SE', // Sweden
  266: 'SE', // Sweden
  267: 'SK', // Slovakia
  268: 'SM', // San Marino
  269: 'CH', // Switzerland
  270: 'CZ', // Czech Republic
  271: 'TR', // Türkiye
  272: 'UA', // Ukraine
  273: 'RU', // Russian Federation
  274: 'MK', // North Macedonia
  275: 'LV', // Latvia
  276: 'EE', // Estonia
  277: 'LT', // Lithuania
  278: 'SI', // Slovenia
  279: 'RS', // Serbia
  301: 'AI', // Anguilla (UK)
  303: 'US', // United States (Alaska)
  304: 'AG', // Antigua and Barbuda
  305: 'AG', // Antigua and Barbuda
  306: 'NL', // Netherlands (Caribbean parts)
  307: 'NL', // Aruba (Netherlands)
  308: 'BS', // Bahamas
  309: 'BS', // Bahamas
  310: 'BM', // Bermuda (UK)
  311: 'BS', // Bahamas
  312: 'BZ', // Belize
  314: 'BB', // Barbados
  316: 'CA', // Canada
  319: 'KY', // Cayman Islands (UK)
  321: 'CR', // Costa Rica
  323: 'CU', // Cuba
  325: 'DM', // Dominica
  327: 'DO', // Dominican Republic
  329: 'GP', // Guadeloupe (France)
  330: 'GD', // Grenada
  331: 'GL', // Greenland (Denmark)
  332: 'GT', // Guatemala
  334: 'HN', // Honduras
  336: 'HT', // Haiti
  338: 'US', // United States
  339: 'JM', // Jamaica
  341: 'KN', // Saint Kitts and Nevis
  343: 'LC', // Saint Lucia
  345: 'MX', // Mexico
  347: 'MQ', // Martinique (France)
  348: 'MS', // Montserrat (UK)
  350: 'NI', // Nicaragua
  351: 'PA', // Panama
  352: 'PA', // Panama
  353: 'PA', // Panama
  354: 'PA', // Panama
  355: 'PA', // Panama
  356: 'PA', // Panama
  357: 'PA', // Panama
  358: 'PR', // Puerto Rico (US)
  359: 'SV', // El Salvador
  361: 'PM', // Saint Pierre and Miquelon (France)
  362: 'TT', // Trinidad and Tobago
  364: 'TC', // Turks and Caicos Islands (UK)
  366: 'US', // United States
  367: 'US', // United States
  368: 'US', // United States
  369: 'US', // United States
  370: 'PA', // Panama
  371: 'PA', // Panama
  372: 'PA', // Panama
  373: 'PA', // Panama
  374: 'PA', // Panama
  375: 'VC', // Saint Vincent and the Grenadines
  376: 'VC', // Saint Vincent and the Grenadines
  377: 'VC', // Saint Vincent and the Grenadines
  378: 'VG', // British Virgin Islands (UK)
  379: 'VI', // United States Virgin Islands (US)
  401: 'AF', // Afghanistan
  403: 'SA', // Saudi Arabia
  405: 'BD', // Bangladesh
  408: 'BH', // Bahrain
  410: 'BT', // Bhutan
  412: 'CN', // China
  413: 'CN', // China
  414: 'CN', // China
  416: 'TW', // Taiwan
  417: 'LK', // Sri Lanka
  419: 'IN', // India
  422: 'IR', // Iran
  423: 'AZ', // Azerbaijan
  425: 'IQ', // Iraq
  428: 'IL', // Israel
  431: 'JP', // Japan
  432: 'JP', // Japan
  434: 'TM', // Turkmenistan
  436: 'KZ', // Kazakhstan
  437: 'UZ', // Uzbekistan
  438: 'JO', // Jordan
  440: 'KR', // South Korea
  441: 'KR', // South Korea
  443: 'PS', // Palestine
  445: 'KP', // North Korea
  447: 'KW', // Kuwait
  450: 'LB', // Lebanon
  451: 'KG', // Kyrgyzstan
  453: 'MO', // Macao
  455: 'MV', // Maldives
  457: 'MN', // Mongolia
  459: 'NP', // Nepal
  461: 'OM', // Oman
  463: 'PK', // Pakistan
  466: 'QA', // Qatar
  468: 'SY', // Syria
  470: 'AE', // United Arab Emirates
  471: 'AE', // United Arab Emirates
  472: 'TJ', // Tajikistan
  473: 'YE', // Yemen
  475: 'YE', // Yemen
  477: 'HK', // Hong Kong
  478: 'BA', // Bosnia and Herzegovina
  501: 'TF', // French Southern Territories (Adelie Land)
  503: 'AU', // Australia
  506: 'MM', // Myanmar
  508: 'BN', // Brunei
  510: 'FM', // Micronesia
  511: 'PW', // Palau
  512: 'NZ', // New Zealand
  514: 'KH', // Cambodia
  515: 'KH', // Cambodia
  516: 'CX', // Christmas Island
  518: 'CK', // Cook Islands
  520: 'FJ', // Fiji
  523: 'CC', // Cocos (Keeling) Islands
  525: 'ID', // Indonesia
  529: 'KI', // Kiribati
  531: 'LA', // Laos
  533: 'MY', // Malaysia
  536: 'MP', // Northern Mariana Islands
  538: 'MH', // Marshall Islands
  540: 'NC', // New Caledonia
  542: 'NU', // Niue
  544: 'NR', // Nauru
  546: 'PF', // French Polynesia
  548: 'PH', // Philippines
  550: 'TL', // Timor-Leste
  553: 'PG', // Papua New Guinea
  555: 'PN', // Pitcairn Islands
  557: 'SB', // Solomon Islands
  559: 'AS', // American Samoa
  561: 'WS', // Samoa
  563: 'SG', // Singapore
  564: 'SG', // Singapore
  565: 'SG', // Singapore
  566: 'SG', // Singapore
  567: 'TH', // Thailand
  570: 'TO', // Tonga
  572: 'TV', // Tuvalu
  574: 'VN', // Vietnam
  576: 'VU', // Vanuatu
  577: 'VU', // Vanuatu
  578: 'WF', // Wallis and Futuna
  601: 'ZA', // South Africa
  603: 'AO', // Angola
  605: 'DZ', // Algeria
  607: 'TF', // Saint Paul and Amsterdam Islands
  608: 'SH', // Ascension Island
  609: 'BI', // Burundi
  610: 'BJ', // Benin
  611: 'BW', // Botswana
  612: 'CF', // Central African Republic
  613: 'CM', // Cameroon
  615: 'CG', // Congo
  616: 'KM', // Comoros
  617: 'CV', // Cape Verde
  618: 'TF', // Crozet Archipelago
  619: 'CI', // Ivory Coast
  620: 'KM', // Comoros
  621: 'DJ', // Djibouti
  622: 'EG', // Egypt
  624: 'ET', // Ethiopia
  625: 'ER', // Eritrea
  626: 'GA', // Gabon
  627: 'GH', // Ghana
  629: 'GM', // Gambia
  630: 'GW', // Guinea-Bissau
  631: 'GQ', // Equatorial Guinea
  632: 'GN', // Guinea
  633: 'BF', // Burkina Faso
  634: 'KE', // Kenya
  635: 'TF', // Kerguelen Islands
  636: 'LR', // Liberia
  637: 'LR', // Liberia
  638: 'SS', // South Sudan
  642: 'LY', // Libya
  644: 'LS', // Lesotho
  645: 'MU', // Mauritius
  647: 'MG', // Madagascar
  649: 'ML', // Mali
  650: 'MZ', // Mozambique
  654: 'MR', // Mauritania
  655: 'MW', // Malawi
  656: 'NE', // Niger
  657: 'NG', // Nigeria
  659: 'NA', // Namibia
  660: 'RE', // Reunion
  661: 'RW', // Rwanda
  662: 'SD', // Sudan
  663: 'SN', // Senegal
  664: 'SC', // Seychelles
  665: 'SH', // Saint Helena
  666: 'SO', // Somalia
  667: 'SL', // Sierra Leone
  668: 'ST', // Sao Tome and Principe
  669: 'SZ', // Eswatini
  670: 'TD', // Chad
  671: 'TG', // Togo
  672: 'TN', // Tunisia
  674: 'TZ', // Tanzania
  675: 'UG', // Uganda
  676: 'CD', // Democratic Republic of the Congo
  677: 'TZ', // Tanzania
  678: 'ZM', // Zambia
  679: 'ZW', // Zimbabwe
  701: 'AR', // Argentina
  710: 'BR', // Brazil
  720: 'BO', // Bolivia
  725: 'CL', // Chile
  730: 'CO', // Colombia
  735: 'EC', // Ecuador
  740: 'FK', // Falkland Islands (UK)
  745: 'GF', // French Guiana
  750: 'GY', // Guyana
  755: 'PY', // Paraguay
  760: 'PE', // Peru
  765: 'SR', // Suriname
  770: 'UY', // Uruguay
  775: 'VE', // Venezuela
};
