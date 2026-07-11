import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { firebaseCloudStorage } from "src/config";

const FirebaseStorageApiTagTypes = {
  maintenanceImage: "property/image",
};

export const firebaseStorageApi = createApi({
  reducerPath: "firebaseStorageApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: Object.values(FirebaseStorageApiTagTypes),
  endpoints: (builder) => ({
    // getMaintenanceImages ...
    // defines a function that returns images associated with maintenance details
    viewMaintenanceImages: builder.query({
      async queryFn({ propertyId, maintenanceId }) {
        try {
          const folderRef = ref(
            firebaseCloudStorage,
            `properties/${propertyId}/maintenance/${maintenanceId}`,
          );

          const { items } = await listAll(folderRef);

          const images = await Promise.all(
            items.map(async (item) => ({
              id: item.name,
              downloadURL: await getDownloadURL(item),
            })),
          );

          return { data: images };
        } catch (error) {
          return {
            error: {
              message: error.message,
              code: error.code,
            },
          };
        }
      },
      providesTags: [FirebaseStorageApiTagTypes.maintenanceImage],
    }),
    // uploadImageToCloud ...
    // defines a function that uploads images
    uploadImg: builder.mutation({
      async queryFn({ file, path }) {
        try {
          const storageRef = ref(firebaseCloudStorage, path);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          return {
            data: {
              downloadURL,
            },
          };
        } catch (error) {
          return {
            error: {
              message: error?.message ?? "Failed to upload image",
              code: error.code,
            },
          };
        }
      },
      invalidatesTags: [FirebaseStorageApiTagTypes.maintenanceImage],
    }),
    // uploadMultipleImagesToCloud ...
    // defines a function that uploads multiple images
    uploadMultipleImages: builder.mutation({
      async queryFn(images) {
        try {
          const results = await Promise.all(
            images.map(async (image) => {
              const storageRef = ref(firebaseCloudStorage, image?.path);

              await uploadBytes(storageRef, image.file);
              const downloadURL = await getDownloadURL(storageRef);

              return {
                id: image.id,
                downloadURL,
              };
            }),
          );

          return { data: results };
        } catch (error) {
          return {
            error: {
              message: error?.message ?? "Failed to upload images",
              code: error?.code,
            },
          };
        }
      },
      invalidatesTags: [FirebaseStorageApiTagTypes.maintenanceImage],
    }),
  }),
});

export const {
  useViewMaintenanceImagesQuery,
  useUploadImgMutation,
  useUploadMultipleImagesMutation,
} = firebaseStorageApi;
