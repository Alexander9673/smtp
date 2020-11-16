export interface SMTPOptionCerts {
  key: Buffer;
  cert: Buffer;
}

export interface SMTPOptions {
  isSecure?: boolean;
  cert?: SMTPOptionCerts;
}
