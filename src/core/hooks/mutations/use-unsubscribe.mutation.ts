import { useMutation } from '@tanstack/react-query';
import authService from '@/services/api/auth.service';

/**
 * Unsubscribe Account Mutation
 *
 * Sends an unsubscribe request to the API with optional reasons
 *
 * Usage:
 * ```ts
 * const { mutate: unsubscribe, isPending } = useUnsubscribeMutation();
 *
 * unsubscribe(['stopContactNotParticipate', 'notReceiveMail'], {
 *   onSuccess: () => {
 *     // Handle success
 *   },
 *   onError: (error) => {
 *     // Handle error
 *   }
 * });
 * ```
 */
export const useUnsubscribeMutation = () => {
  return useMutation({
    mutationFn: async (reasons?: string[]) => {
      await authService.unsubscribeAccount(reasons);
    },
  });
};
