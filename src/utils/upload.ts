import { generateId } from "@designcombo/timeline";

const BASE_URL = import.meta.env.PROD 
  ? "https://transcribe.designcombo.dev/presigned-url"
  : "http://localhost:5175/api/presigned-url";

interface IUploadDetails {
  uploadUrl: string;
  url: string;
  name: string;
  id: string;
}

export const createUploadsDetails = async (
  fileName: string,
  fileContent?: File // Optionnel, utilisé uniquement en développement
): Promise<IUploadDetails> => {
  const currentFormat = fileName.split(".").pop();
  const uniqueFileName = `${generateId()}`;
  const updatedFileName = `${uniqueFileName}.${currentFormat}`;

  // Mode développement : simulation locale
  if (fileContent) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        resolve({
          uploadUrl: dataUrl,
          url: dataUrl,
          name: updatedFileName,
          id: uniqueFileName,
        });
      };
      reader.readAsDataURL(fileContent);
    });
  }

  // Mode production : appel au serveur
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ fileName: updatedFileName }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      uploadUrl: data.presigned_url as string,
      url: data.url as string,
      name: updatedFileName,
      id: uniqueFileName,
    };
  } catch (error) {
    console.warn("Serveur d'upload inaccessible, utilisation du mode local");
    
    if (fileContent) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          resolve({
            uploadUrl: dataUrl,
            url: dataUrl,
            name: updatedFileName,
            id: uniqueFileName,
          });
        };
        reader.readAsDataURL(fileContent);
      });
    }
    
    throw error;
  }
};
