const SEVERITIES = ['log', 'error', 'warn', 'info'] as const;

type Severity = typeof SEVERITIES[number];

class Logger {
  log = (...args: any[]) => this.execute('log', ...args);
  error = (...args: any[]) => this.execute('error', ...args);
  warn = (...args: any[]) => this.execute('warn', ...args);
  info = (...args: any[]) => this.execute('info', ...args);

  execute(severity: Severity, ...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console[severity](...args);
    }
  }
}

const logger = new Logger();

export default logger;
