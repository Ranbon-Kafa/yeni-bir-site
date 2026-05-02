function logout() {
  fetch('/logout', { method: 'POST' })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem("username");
      window.location.href = "login.html";
    })
    .catch(() => {
      localStorage.removeItem("username");
      window.location.href = "login.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const videoListElement = document.getElementById("videoList");
  
  if (videoListElement) {
    fetch('/videos')
      .then(res => res.json())
      .then(videos => {
        videoListElement.innerHTML = '';
        if (!videos || videos.length === 0) {
          videoListElement.innerHTML = "<p>Henüz video yüklenmemiş.</p>";
        } else {
          videos.reverse().forEach(video => {
            const div = document.createElement("div");
            div.className = "video-item";
            const uploaderName = video.uploader ? video.uploader : 'Anonim';
            div.innerHTML = `
              <p style="margin-bottom: 10px;"><strong>${uploaderName}</strong> paylaştı</p>
              <video controls>
                <source src="${video.path}">
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
            `;
            videoListElement.appendChild(div);
          });
        }
      })
      .catch(() => {
        videoListElement.innerHTML = "<p style='color:red;'>Videolar yüklenemedi (Sunucu bağlantısı yok).</p>";
      });
  }
});