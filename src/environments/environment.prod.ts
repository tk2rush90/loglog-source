import {commonEnvironments} from './environment.common';

export const environment = {
  production: true,
  dataApi: 'https://tk2blog90.github.io/assets/data',
  /**
   * Default href of application
   */
  href: `https://tk2blog90.github.io`,
  ...commonEnvironments,
};
