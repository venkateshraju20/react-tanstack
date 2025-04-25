import { useEffect, useState } from "react";

interface AdobePdfViewerProps {
  url: string;
  clientId: string;
  fileName: string;
}

declare global {
  interface Window {
    AdobeDC?: {
      View: new (options: { clientId: string }) => {
        previewFile: (
          fileInfo: {
            content: { location: { url: string } };
            metaData: { fileName: string };
          },
          options: {
            embedMode: "LIGHT_BOX";
            showDownloadPDF?: boolean;
            showPrintPDF?: boolean;
          }
        ) => void;
      };
    };
  }
}

const AdobePdfViewer = ({ url, clientId, fileName }: AdobePdfViewerProps) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const ready = () => setIsReady(true);

    if (window.AdobeDC) {
      ready();
    } else {
      document.addEventListener("adobe_dc_view_sdk.ready", ready);
      return () =>
        document.removeEventListener("adobe_dc_view_sdk.ready", ready);
    }
  }, []);

  const openLightbox = () => {
    if (!window.AdobeDC) return;

    const view = new window.AdobeDC.View({ clientId });

    view.previewFile(
      {
        content: { location: { url } },
        metaData: { fileName },
      },
      {
        embedMode: "LIGHT_BOX",
        showDownloadPDF: true,
        showPrintPDF: true,
      }
    );
  };

  return (
    <button onClick={openLightbox} disabled={!isReady}>
      Open PDF
    </button>
  );
};

export default AdobePdfViewer;
