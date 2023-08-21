// need to be set on build/by cmd or powershell
// like (powershell): 
// >
// > $Env:NEXTJS_ROBINIADOCS_ENV='Staging'
//

const env = process.env.NEXTJS_ROBINIADOCS_ENV || 'Development';

const current = {
  Development: {
    backendUrl: 'https://localhost:7111/',
    githubOAuthLoginUrl: 'https://github.com/login/oauth/authorize?scope=user%3Aemail&client_id=51459d3ec22cb7d0a88d',
  },
  Staging: {
    backendUrl: 'http://www.robiniadocs.com:5000/',
    githubOAuthLoginUrl: 'https://github.com/login/oauth/authorize?scope=user%3Aemail&client_id=51459d3ec22cb7d0a88d',

  },
  Production: {
    backendUrl: 'https://www.robiniadocs.com/',
    githubOAuthLoginUrl: 'https://github.com/login/oauth/authorize?scope=user%3Aemail&client_id=bbb68d46c8e487e74030',
  },
}[env];


const config = {
  backendUrl: current?.backendUrl,
  githubOAuthLoginUrl: current?.githubOAuthLoginUrl, 
  env: {
    environment: env,
    isDevelopment: env === 'Development',
    isStaging: env === 'Staging',
    isProduction: env === 'Production',
  }
}

export default config;