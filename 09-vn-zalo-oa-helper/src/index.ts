export interface ZNSOptions {
  phone: string;
  templateId: string;
  templateData: Record<string, any>;
  trackingId?: string;
  development?: boolean;
}

export function normalizeZaloPhone(phone: string): string {
  const clean = String(phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    return '84' + clean.slice(1);
  }
  if (clean.startsWith('84')) {
    return clean;
  }
  return clean;
}

export function buildZNSPayload(options: ZNSOptions) {
  return {
    phone: normalizeZaloPhone(options.phone),
    template_id: options.templateId,
    template_data: options.templateData,
    tracking_id: options.trackingId,
    mode: options.development ? 'development' : undefined
  };
}
