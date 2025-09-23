import { ref, computed, readonly } from 'vue';
import PayphoneService from '@/services/payphone';
import type { PayphoneResponse } from '@/config/payphone';

/**
 * Composable para manejar pagos con Payphone
 * Proporciona estado reactivo y métodos para procesar pagos
 */
export function usePayphonePayment() {
  // Estado reactivo
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentTransaction = ref<PayphoneResponse | null>(null);

  // Estados computados
  const hasError = computed(() => !!error.value);
  const isProcessing = computed(() => isLoading.value);
  const canPay = computed(() => !isLoading.value && !hasError.value);

  /**
   * Limpia el estado de error
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Limpia toda la información de la transacción actual
   */
  const clearTransaction = () => {
    currentTransaction.value = null;
    error.value = null;
    isLoading.value = false;
  };

  /**
   * Inicia el proceso de pago para un producto
   * @param productData - Datos del producto a pagar
   */
  const initiatePayment = async (productData: {
    productId: string;
    productName: string;
    price: number;
    description?: string;
  }) => {
    try {
      // Limpiar estado previo
      clearError();
      isLoading.value = true;

      console.log('💳 Iniciando pago para:', productData.productName);

      // Preparar el pago con Payphone
      const response = await PayphoneService.preparePayment(productData);
      
      // Guardar la transacción actual
      currentTransaction.value = response;

      // Verificar que tenemos una URL de pago válida
      if (!response.payWithPayPhone) {
        throw new Error('No se recibió URL de pago válida de Payphone');
      }

      console.log('✅ Pago preparado, redirigiendo a Payphone...');

      // Redirigir al usuario a Payphone
      PayphoneService.redirectToPayment(response.payWithPayPhone);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar el pago';
      error.value = errorMessage;
      console.error('❌ Error en pago:', errorMessage);
      
      // Mostrar notificación de error al usuario
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Confirma un pago después del retorno de Payphone
   * @param transactionId - ID de la transacción de Payphone
   * @param clientTransactionId - ID de la transacción del cliente
   */
  const confirmPayment = async (
    transactionId: string, 
    clientTransactionId: string
  ): Promise<PayphoneResponse | null> => {
    try {
      clearError();
      isLoading.value = true;

      console.log('🔍 Confirmando pago:', { transactionId, clientTransactionId });

      const response = await PayphoneService.confirmPayment(transactionId, clientTransactionId);
      
      // Actualizar la transacción actual con la confirmación
      currentTransaction.value = response;

      console.log('✅ Pago confirmado:', response.transactionStatus);

      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al confirmar el pago';
      error.value = errorMessage;
      console.error('❌ Error en confirmación:', errorMessage);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Procesa la respuesta de Payphone desde una URL
   * @param url - URL con parámetros de respuesta de Payphone
   */
  const processPayphoneResponse = async (url: string) => {
    try {
      // Verificar si la URL contiene parámetros de Payphone
      if (!PayphoneService.isPayphoneResponse(url)) {
        throw new Error('URL no contiene parámetros válidos de Payphone');
      }

      // Extraer parámetros de la URL
      const params = PayphoneService.extractResponseParams(url);
      if (!params) {
        throw new Error('No se pudieron extraer los parámetros de la respuesta');
      }

      // Confirmar el pago
      const result = await confirmPayment(params.transactionId, params.clientTransactionId);
      
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar respuesta de Payphone';
      error.value = errorMessage;
      console.error('❌ Error procesando respuesta:', errorMessage);
      return null;
    }
  };

  /**
   * Obtiene el estado de la transacción actual
   */
  const getTransactionStatus = computed(() => {
    if (!currentTransaction.value) return null;
    
    return {
      id: currentTransaction.value.transactionId,
      clientId: currentTransaction.value.clientTransactionId,
      status: currentTransaction.value.transactionStatus,
      message: currentTransaction.value.message,
      isApproved: currentTransaction.value.transactionStatus === 'Approved',
      isPending: currentTransaction.value.transactionStatus === 'Pending',
      isRejected: currentTransaction.value.transactionStatus === 'Rejected'
    };
  });

  /**
   * Formatea el estado de la transacción para mostrar al usuario
   */
  const getStatusMessage = computed(() => {
    const status = getTransactionStatus.value;
    if (!status) return '';

    switch (status.status) {
      case 'Approved':
        return '✅ Pago aprobado exitosamente';
      case 'Pending':
        return '⏳ Pago pendiente de confirmación';
      case 'Rejected':
        return '❌ Pago rechazado';
      default:
        return '❓ Estado de pago desconocido';
    }
  });

  return {
    // Estado reactivo
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentTransaction: readonly(currentTransaction),
    
    // Estados computados
    hasError,
    isProcessing,
    canPay,
    getTransactionStatus,
    getStatusMessage,
    
    // Métodos
    initiatePayment,
    confirmPayment,
    processPayphoneResponse,
    clearError,
    clearTransaction
  };
}

export default usePayphonePayment;