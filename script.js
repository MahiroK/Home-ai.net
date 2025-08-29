const postList = document.getElementById("postList");

// いいねを切り替える
function toggleLike(button) {
  const likeCountSpan = button.nextElementSibling;
  let likeCount = parseInt(likeCountSpan.textContent, 10) || 0;

  likeCount++;
  likeCountSpan.textContent = likeCount;

  savePostsToLocalStorage();
}

// 投稿データをローカルストレージに保存
function savePostsToLocalStorage() {
  const posts = Array.from(document.querySelectorAll(".post-card")).map(
    (post) => {
      const emoji = post.querySelector(".post-emoji").textContent;
      const username = post.querySelector(".post-username").textContent;
      const content = post.querySelector(".post-content").textContent;
      const category = post
        .querySelector(".post-category")
        .textContent.replace("#", "");
      const likeCount = parseInt(
        post.querySelector(".like-count").textContent,
        10
      );
      const comments = Array.from(post.querySelectorAll(".comment")).map(
        (comment) => {
          const commentUsername = comment.querySelector("strong").textContent;
          const commentText = comment.textContent.replace(
            `${commentUsername}: `,
            ""
          );
          return { username: commentUsername, text: commentText };
        }
      );

      return {
        emoji,
        username,
        content,
        category,
        likeCount,
        comments,
      };
    }
  );

  localStorage.setItem("posts", JSON.stringify(posts));
}

// ローカルストレージから投稿データを復元
function loadPostsFromLocalStorage() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <div class="post-header">
        <span class="post-emoji">${post.emoji}</span>
        <div>
          <div class="post-username">${post.username}</div>
          <div class="post-category">#${post.category}</div>
        </div>
        <button class="delete-btn" onclick="deletePost(this)">削除</button>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="like-section">
        <button class="like-btn" onclick="toggleLike(this)">❤️ いいね</button>
        <span class="like-count">${post.likeCount}</span>
      </div>
      <div class="comment-section">
        <div class="comments">
          ${post.comments
            .map(
              (comment) =>
                `<div class="comment"><strong>${comment.username}</strong>: ${comment.text}</div>`
            )
            .join("")}
        </div>
        <div class="comment-form">
          <input class="comment-username" placeholder="名前" />
          <input class="comment-input" placeholder="コメントを入力" />
          <button onclick="addComment(this)">コメント</button>
        </div>
      </div>
    `;
    postList.appendChild(card);
  });
}

// 投稿を追加
function addPost() {
  const emoji = document.getElementById("emoji").value;
  const username = document.getElementById("username").value;
  const content = document.getElementById("content").value;
  const category = document.getElementById("category").value;

  if (!emoji || !username || !content) return;

  const card = document.createElement("div");
  card.className = "post-card";
  card.innerHTML = `
    <div class="post-header">
      <span class="post-emoji">${emoji}</span>
      <div>
        <div class="post-username">${username}</div>
        <div class="post-category">#${category}</div>
      </div>
      <button class="delete-btn" onclick="deletePost(this)">削除</button>
    </div>
    <div class="post-content">${content}</div>
    <div class="like-section">
      <button class="like-btn" onclick="toggleLike(this)">❤️ いいね</button>
      <span class="like-count">0</span>
    </div>
    <div class="comment-section">
      <div class="comments"></div>
      <div class="comment-form">
        <input class="comment-username" placeholder="名前" />
        <input class="comment-input" placeholder="コメントを入力" />
        <button onclick="addComment(this)">コメント</button>
      </div>
    </div>
  `;

  postList.prepend(card);

  document.getElementById("emoji").value = "";
  document.getElementById("username").value = "";
  document.getElementById("content").value = "";

  savePostsToLocalStorage();
}

// コメントを追加
function addComment(button) {
  const commentForm = button.closest(".comment-form");
  const commentUsername = commentForm.querySelector(".comment-username").value;
  const commentInput = commentForm.querySelector(".comment-input").value;

  if (!commentUsername || !commentInput) return;

  const commentSection = button
    .closest(".comment-section")
    .querySelector(".comments");

  const comment = document.createElement("div");
  comment.className = "comment";
  comment.innerHTML = `<strong>${commentUsername}</strong>: ${commentInput}`;

  commentSection.appendChild(comment);

  commentForm.querySelector(".comment-username").value = "";
  commentForm.querySelector(".comment-input").value = "";

  savePostsToLocalStorage();
}

// 投稿を削除
function deletePost(button) {
  button.closest(".post-card").remove();
  savePostsToLocalStorage();
}

// ページ読み込み時に投稿を復元
document.addEventListener("DOMContentLoaded", loadPostsFromLocalStorage);
