import Swal from "sweetalert2";

const DownloadPdf = (url) => {
    fetch(url).then(response => response.blob()).then(blob => {
        const blobURL = window.URL.createObjectURL(new Blob([blob]));
        const fileName = url.split("/").pop();
        const a = document.createElement("a");
        a.href = blobURL;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        notif()
    })
}

async function notif() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    
      await Toast.fire({
      icon: 'info',
      title: `Downloading`
      })
}

export default DownloadPdf