export class InitiatePaymentResponseDto {
  token: string;
  redirectUrl: string;
}

export class midtransNotificationRequestDto {
  order_id: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
  gross_amount: string;
  transaction_id: string;
  signature_key: string;
  status_code: string;
}
