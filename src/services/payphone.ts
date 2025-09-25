import { 
  PAYPHONE_CONFIG, 
  type PayphoneTransaction, 
  type PayphoneResponse,
  dollarsToCents,
  generateTransactionId 
} from '@/config/payphone';

/**
 * Servicio para manejar las transacciones de Payphone
 * Implementa el flujo completo de Button/Prepare y Button/Confirm
 */
export class PayphoneService {
  
  /**
   * Prepara una transacción de pago con Payphone
   * @param productData - Datos del producto para el pago
   * @returns Promise con la respuesta de Payphone incluyendo la URL de pago
   */
  static async preparePayment(productData: {
    productId: string;
    productName: string;
    price: number;
    description?: string;
  }): Promise<PayphoneResponse> {
    try {
      // Generar ID único para la transacción
      const clientTransactionId = generateTransactionId(productData.productId);
      
      // Convertir precio a centavos
      const amountInCents = dollarsToCents(productData.price);
      
      // Preparar el cuerpo de la solicitud
      const transactionData: PayphoneTransaction = {
        amount: amountInCents,
        amountWithoutTax: amountInCents, // Asumiendo que el precio ya incluye impuestos
        tax: 0,
        service: 0,
        tip: 0,
        currency: PAYPHONE_CONFIG.CURRENCY,
        reference: `${productData.productName} - ${productData.productId}`,
        clientTransactionId,
        storeId: PAYPHONE_CONFIG.STORE_ID,
        responseUrl: PAYPHONE_CONFIG.RESPONSE_URL,
        cancellationUrl: PAYPHONE_CONFIG.CANCEL_URL
      };

      console.log('🚀 Preparando pago Payphone:', {
        product: productData.productName,
        amount: `$${productData.price}`,
        transactionId: clientTransactionId
      });

      // Realizar la solicitud POST a la API de Payphone
      const response = await fetch(PAYPHONE_CONFIG.BUTTON_PREPARE_URL, {
        method: 'POST',
        headers: PAYPHONE_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta de Payphone:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: PayphoneResponse = await response.json();
      
      console.log('✅ Pago preparado exitosamente:', {
        transactionId: result.transactionId,
        status: result.transactionStatus,
        hasPaymentUrl: !!result.payWithPayPhone
      });

      return result;

    } catch (error) {
      console.error('❌ Error al preparar pago Payphone:', error);
      throw new Error(
        error instanceof Error 
          ? `Error al procesar el pago: ${error.message}`
          : 'Error desconocido al procesar el pago'
      );
    }
  }

  /**
   * Confirma una transacción después del retorno de Payphone
   * @param transactionId - ID de la transacción de Payphone
   * @param clientTransactionId - ID de la transacción del cliente
   * @returns Promise con el estado final de la transacción
   */
  static async confirmPayment(
    transactionId: string, 
    clientTransactionId: string
  ): Promise<PayphoneResponse> {
    try {
      const confirmData = {
        id: transactionId,
        clientTransactionId
      };

      console.log('🔍 Confirmando pago Payphone:', confirmData);

      const response = await fetch(PAYPHONE_CONFIG.BUTTON_CONFIRM_URL, {
        method: 'POST',
        headers: PAYPHONE_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify(confirmData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en confirmación de Payphone:', {
          status: response.status,
          error: errorText
        });
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result: PayphoneResponse = await response.json();
      
      console.log('✅ Confirmación de pago:', {
        transactionId: result.transactionId,
        status: result.transactionStatus
      });

      return result;

    } catch (error) {
      console.error('❌ Error al confirmar pago:', error);
      throw new Error(
        error instanceof Error 
          ? `Error al confirmar el pago: ${error.message}`
          : 'Error desconocido al confirmar el pago'
      );
    }
  }

  /**
   * Redirige al usuario a la página de pago de Payphone
   * @param paymentUrl - URL de pago proporcionada por Payphone
   */
  static redirectToPayment(paymentUrl: string): void {
    if (!paymentUrl) {
      throw new Error('URL de pago no válida');
    }

    console.log('🔄 Redirigiendo a Payphone:', paymentUrl);
    
    // Redirigir en la misma ventana para mantener el contexto
    window.location.href = paymentUrl;
  }

  /**
   * Valida si una URL de respuesta contiene parámetros de Payphone
   * @param url - URL a validar
   * @returns boolean indicando si contiene parámetros válidos
   */
  static isPayphoneResponse(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hasId = urlObj.searchParams.has('id');
      const hasClientTransactionId = urlObj.searchParams.has('clientTransactionId');
      
      return hasId && hasClientTransactionId;
    } catch {
      return false;
    }
  }

  /**
   * Extrae los parámetros de respuesta de Payphone de una URL
   * @param url - URL con parámetros de respuesta
   * @returns Objeto con los parámetros extraídos
   */
  static extractResponseParams(url: string): {
    transactionId: string;
    clientTransactionId: string;
  } | null {
    try {
      const urlObj = new URL(url);
      const transactionId = urlObj.searchParams.get('id');
      const clientTransactionId = urlObj.searchParams.get('clientTransactionId');

      if (!transactionId || !clientTransactionId) {
        return null;
      }

      return {
        transactionId,
        clientTransactionId
      };
    } catch {
      return null;
    }
  }
}

export default PayphoneService;