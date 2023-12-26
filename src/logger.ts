class Logger {
    private appInsights: any;  
    private client: any;  
  
    constructor(instrumentationKey?: string) {
      try {
        this.appInsights = require('applicationinsights');
        this.appInsights.setup(instrumentationKey).start();
        this.client = this.appInsights.defaultClient;
      } catch (error) {
        console.error('Failed to initialize Application Insights:', error);
      }
    }
  
    log(event:string = '/', message: string): void {
      if (this.client) {
        this.client.trackEvent({ name: event, properties: { message} });
      } else {
        console.log(`Event ${event}: ${message} `);
      }
    }
  }

  export default new Logger('60f412a8-a813-410c-94f1-5ca7c1e6892e')
  
 