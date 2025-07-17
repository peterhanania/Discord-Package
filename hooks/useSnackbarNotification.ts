import { useSnackbar } from 'notistack';

export enum SnackbarNotificationType {
	DEFAULT = 'default',
	ERROR = 'error',
	SUCCESS = 'success',
	WARNING = 'warning',
	INFO = 'info',
}

export const useSnackbarNotification = () => {
	const { enqueueSnackbar } = useSnackbar();

	const showSnackbar = (message: string, type: SnackbarNotificationType = SnackbarNotificationType.INFO) => {
		enqueueSnackbar(message, {
			variant: type,
			autoHideDuration: 2000,
			anchorOrigin: {
				vertical: "bottom",
				horizontal: "center",
			},
		});
	};

	return {
		showSnackbar,
	};
};