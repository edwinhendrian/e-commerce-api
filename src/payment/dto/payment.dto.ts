import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentResponseDto {
  @ApiProperty()
  token: string;
  @ApiProperty()
  redirectUrl: string;
}

export class MidtransNotificationRequestDto {
  @ApiProperty()
  order_id: string;
  @ApiProperty()
  payment_type: string;
  @ApiProperty()
  transaction_status: string;
  @ApiProperty()
  transaction_time: string;
  @ApiProperty()
  gross_amount: string;
  @ApiProperty()
  transaction_id: string;
  @ApiProperty()
  signature_key: string;
  @ApiProperty()
  status_code: string;
}
