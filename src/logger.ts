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

  export default new Logger('6594dca3-9bf1-4f07-8610-a4c1fbdb9b34')
  
 