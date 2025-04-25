import "./App.css";
import UsersTable from "./components/users";
import AdobePdfViewer from "./share/pdf-viewer";

function App() {
  return (
    <div>
      <AdobePdfViewer
        url="https://acrobatservices.adobe.com/view-sdk-demo/PDFs/Bodea%20Brochure.pdf"
        clientId="" // remove while pushing to github
        fileName="sample.pdf"
      />
      <UsersTable />
    </div>
  );
}

export default App;
