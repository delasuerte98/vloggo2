// Tipi e util per errori di rete/API

export type AppErrorCode =
  | 'UNAUTHORIZED'     // 401
  | 'FORBIDDEN'        // 403
  | 'NOT_FOUND'        // 404
  | 'VALIDATION'       // 422
  | 'RATE_LIMITED'     // 429
  | 'SERVER_ERROR'     // 5xx
  | 'TIMEOUT'
  | 'NETWORK'
  | 'CANCELLED'
  | 'UNKNOWN';

export class AppError extends Error {
  code: AppErrorCode;
  status?: number;
  details?: unknown;

  constructor(code: AppErrorCode, message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function codeFromStatus(status: number): AppErrorCode {
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION';
  if (status === 429) return 'RATE_LIMITED';
  if (status >= 500) return 'SERVER_ERROR';
  return 'UNKNOWN';
}

// Messaggi user-friendly (override se vuoi localizzare meglio)
export function defaultMessage(code: AppErrorCode): string {
  switch (code) {
    case 'UNAUTHORIZED': return 'Sessione scaduta. Accedi di nuovo.';
    case 'FORBIDDEN':    return 'Non hai i permessi per questa azione.';
    case 'NOT_FOUND':    return 'Risorsa non trovata.';
    case 'VALIDATION':   return 'Dati non validi.';
    case 'RATE_LIMITED': return 'Troppe richieste. Riprova più tardi.';
    case 'SERVER_ERROR': return 'Errore del server. Riprova più tardi.';
    case 'TIMEOUT':      return 'Connessione lenta. Timeout.';
    case 'NETWORK':      return 'Sei offline o la rete non risponde.';
    case 'CANCELLED':    return 'Richiesta annullata.';
    default:             return 'Errore inatteso.';
  }
}
