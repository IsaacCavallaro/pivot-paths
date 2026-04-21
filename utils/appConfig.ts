import Constants from 'expo-constants';

type AppLinks = {
  websiteUrl: string;
  supportUrl: string;
  supportEmail: string;
  privacyPolicyUrl: string;
  productsUrl: string;
  servicesUrl: string;
  resourcesUrl: string;
};

const fallbackLinks: AppLinks = {
  websiteUrl: 'https://pivotfordancers.com/',
  supportUrl: 'https://pivotfordancers.com/resources/pivot-paths/',
  supportEmail: 'pivotfordancers@gmail.com',
  privacyPolicyUrl: 'https://drive.google.com/file/d/1XiqWl5qiHd1xCGF62D300hyodmsCe5OC/view?usp=sharing',
  productsUrl: 'https://pivotfordancers.com/products/',
  servicesUrl: 'https://pivotfordancers.com/services/',
  resourcesUrl: 'https://pivotfordancers.com/resources/',
};

const extraLinks = Constants.expoConfig?.extra?.links as Partial<AppLinks> | undefined;

export const appLinks: AppLinks = {
  ...fallbackLinks,
  ...extraLinks,
};
