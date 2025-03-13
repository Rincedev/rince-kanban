import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const toast = {

    init() {
        iziToast.settings({
            position: 'topRight',
            transitionIn: 'fadeInUp',
            transitionOut: 'fadeOutDown',
            transitionInMobile: 'fadeInUp',
            transitionOutMobile: 'fadeOutDown',
            timeout: 5000,
        });
    },
  
    success(message) {
        iziToast.success({message});
    },
    error(message) {
        iziToast.error({message});
    },
    warning(message) {
        iziToast.warning({message});
    }
}

export default toast;
