import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CHIYODA_ID } from '@/constants';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { supabase } from '@/lib/supabase';

interface CreateReplyData {
  userId: string;
  cityId?: string;
  content: string;
  postId: string;
}

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: CreateReplyData) {
      const { userId, content, cityId = CHIYODA_ID, postId } = data;

      const { error } = await supabase.from('replies').insert({
        author: userId,
        city: cityId,
        content,
        post: postId,
      });

      if (error) {
        throw new Error(error.message);
      }

      return;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(postId: string) {
      const { error } = await supabase
        .from('replies')
        .delete()
        .eq('id', postId);

      if (error) {
        throw new Error(error.message);
      }

      return;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });
    },
  });
};
