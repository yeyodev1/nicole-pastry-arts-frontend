import { ref, reactive } from 'vue';

export interface ModalConfig {
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  persistent?: boolean;
  confirmText?: string;
  cancelText?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  showCloseButton: boolean;
  persistent: boolean;
  confirmText: string;
  cancelText: string;
  showConfirm: boolean;
  showCancel: boolean;
}

export function useModal() {
  const modalState = reactive<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    showCloseButton: true,
    persistent: false,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showConfirm: false,
    showCancel: false,
  });

  const resolvePromise = ref<((value: boolean) => void) | null>(null);

  const defaultConfig: ModalConfig = {
    type: 'info',
    showCloseButton: true,
    persistent: false,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showConfirm: false,
    showCancel: false,
  };

  const openModal = (message: string, config: ModalConfig = {}) => {
    const finalConfig = { ...defaultConfig, ...config };
    
    modalState.isOpen = true;
    modalState.message = message;
    modalState.title = finalConfig.title || '';
    modalState.type = finalConfig.type || 'info';
    modalState.showCloseButton = finalConfig.showCloseButton ?? true;
    modalState.persistent = finalConfig.persistent ?? false;
    modalState.confirmText = finalConfig.confirmText || 'Confirmar';
    modalState.cancelText = finalConfig.cancelText || 'Cancelar';
    modalState.showConfirm = finalConfig.showConfirm ?? false;
    modalState.showCancel = finalConfig.showCancel ?? false;
  };

  const closeModal = () => {
    modalState.isOpen = false;
    if (resolvePromise.value) {
      resolvePromise.value(false);
      resolvePromise.value = null;
    }
  };

  const confirmModal = () => {
    modalState.isOpen = false;
    if (resolvePromise.value) {
      resolvePromise.value(true);
      resolvePromise.value = null;
    }
  };

  // Métodos de conveniencia para diferentes tipos de modales
  const showSuccess = (message: string, config: Omit<ModalConfig, 'type'> = {}) => {
    openModal(message, { ...config, type: 'success' });
  };

  const showError = (message: string, config: Omit<ModalConfig, 'type'> = {}) => {
    openModal(message, { ...config, type: 'error' });
  };

  const showWarning = (message: string, config: Omit<ModalConfig, 'type'> = {}) => {
    openModal(message, { ...config, type: 'warning' });
  };

  const showInfo = (message: string, config: Omit<ModalConfig, 'type'> = {}) => {
    openModal(message, { ...config, type: 'info' });
  };

  // Modal de confirmación que retorna una promesa
  const confirm = (
    message: string, 
    config: Omit<ModalConfig, 'showConfirm' | 'showCancel'> = {}
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      resolvePromise.value = resolve;
      openModal(message, {
        ...config,
        showConfirm: true,
        showCancel: true,
        persistent: true,
      });
    });
  };

  // Modal de alerta simple
  const alert = (
    message: string,
    config: Omit<ModalConfig, 'showConfirm'> = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolvePromise.value = () => resolve();
      openModal(message, {
        ...config,
        showConfirm: true,
        showCancel: false,
      });
    });
  };

  return {
    modalState,
    openModal,
    closeModal,
    confirmModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
    alert,
  };
}