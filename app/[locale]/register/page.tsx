import { RegisterForm } from '@/app/components/RegisterForm';
import { Anchor, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <RegisterForm
          labelReadToS={t('readToS')}
          labelAgreedToS={t('agreedToS')}
          tosHeader={t('tosHeader')}
          tos={t('tos')}
          labelAccountType={t('accountType')}
          labelUserName={t('userName')}
          placeHolderUserNamePersonal={t('placeHolderUserNamePersonal')}
          placeHolderUserNameShared={t('placeHolderUserNameShared')}
          labelCheckUserName={t('checkUserName')}
          labelPersonal={t('personal')}
          labelShared={t('shared')}
          labelAgree={t('agree')}
          labelEmail={t('email')}
          labelPassword={t('password')}
          labelPasswordAgain={t('passwordAgain')}
          labelSubmit={t('submit')}
          labelSuccess={t('success')}
          labelError={t('error')}
          labelValidateUserName={t('validate.userName')}
          labelValidateEmail={t('validate.email')}
          labelValidatePassword={t('validate.password')}
          labelValidatePasswordAgain={t('validate.passwordAgain')}
          labelValidateToS={t('validate.tos')}
        />
        <Text>
          {t.rich('alreadyHaveAccount', {
            link: (text) => <Anchor href="/login">{text}</Anchor>,
          })}
        </Text>
      </Stack>
    </Container>
  );
}
