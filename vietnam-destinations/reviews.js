/**
 * PCCV ETOURISM — Reviews Module
 * Viết đánh giá / review điểm đến
 * Lưu trữ qua localStorage, tích hợp với auth.js
 *
 * CÁCH DÙNG:
 *   1. Thêm <script src="reviews.js"></script> vào destinations.html (sau auth.js)
 *   2. Gọi Reviews.mount('destination-id', containerElement) để gắn widget vào trang
 *
 * VÍ DỤ:
 *   Reviews.mount('sapa', document.getElementById('review-section-sapa'));
 */

const Reviews = (() => {
    const STORAGE_KEY = 'pccv_reviews';

    // ─── Storage helpers ──────────────────────────────────────────────────────
    function loadAll() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch { return {}; }
    }

    function saveAll(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function getReviews(destinationId) {
        return (loadAll()[destinationId] || []).sort((a, b) => b.createdAt - a.createdAt);
    }

    function addReview(destinationId, review) {
        const all = loadAll();
        if (!all[destinationId]) all[destinationId] = [];
        all[destinationId].push(review);
        saveAll(all);
    }

    function deleteReview(destinationId, reviewId) {
        const all = loadAll();
        if (!all[destinationId]) return;
        all[destinationId] = all[destinationId].filter(r => r.id !== reviewId);
        saveAll(all);
    }

    // ─── Auth bridge (dùng auth.js có sẵn) ───────────────────────────────────
    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('pccv_current_user')); }
        catch { return null; }
    }

    // ─── Rating helpers ───────────────────────────────────────────────────────
    function calcAverage(reviews) {
        if (!reviews.length) return 0;
        return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    }

    function renderStars(rating, interactive = false, name = '') {
        if (interactive) {
            return [1, 2, 3, 4, 5].map(i => `
                <input type="radio" id="${name}-star${i}" name="${name}" value="${i}" style="display:none;">
                <label for="${name}-star${i}" data-value="${i}" style="font-size:1.6rem;cursor:pointer;color:#CBD5E1;transition:color 0.15s;">★</label>
            `).reverse().join('');
        }
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        return [1, 2, 3, 4, 5].map(i => {
            if (i <= full) return `<span style="color:#F59E0B;">★</span>`;
            if (i === full + 1 && half) return `<span style="color:#F59E0B;opacity:0.6;">★</span>`;
            return `<span style="color:#CBD5E1;">★</span>`;
        }).join('');
    }

    function timeAgo(ts) {
        const diff = Date.now() - ts;
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'vừa xong';
        if (m < 60) return `${m} phút trước`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h} giờ trước`;
        const d = Math.floor(h / 24);
        if (d < 30) return `${d} ngày trước`;
        return new Date(ts).toLocaleDateString('vi-VN');
    }

    // ─── CSS (inject once) ────────────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('pccv-reviews-style')) return;
        const style = document.createElement('style');
        style.id = 'pccv-reviews-style';
        style.textContent = `
            .rv-root { font-family: 'Inter', sans-serif; color: #0C4A6E; }

            /* Summary bar */
            .rv-summary {
                display: flex; align-items: center; gap: 1.5rem;
                background: linear-gradient(135deg, #F0F9FF, #E0F2FE);
                border: 1px solid #BAE6FD; border-radius: 16px;
                padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;
            }
            .rv-avg-score {
                font-size: 2.75rem; font-weight: 800; color: #0C4A6E;
                line-height: 1; letter-spacing: -0.04em;
            }
            .rv-avg-label { font-size: 0.78rem; color: #64748B; margin-top: 0.2rem; }
            .rv-bars { flex: 1; display: flex; flex-direction: column; gap: 4px; }
            .rv-bar-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #64748B; }
            .rv-bar-track { flex: 1; height: 6px; background: #BAE6FD; border-radius: 99px; overflow: hidden; }
            .rv-bar-fill { height: 100%; background: linear-gradient(90deg, #F59E0B, #F97316); border-radius: 99px; transition: width 0.5s ease; }

            /* Form */
            .rv-form-wrap {
                background: #fff; border: 1.5px solid #BAE6FD; border-radius: 16px;
                padding: 1.5rem; margin-bottom: 1.5rem;
            }
            .rv-form-title { font-size: 1rem; font-weight: 700; color: #0C4A6E; margin-bottom: 1rem; }
            .rv-star-group { display: flex; flex-direction: row-reverse; justify-content: flex-end; gap: 4px; margin-bottom: 1rem; }
            .rv-star-group input { display: none; }
            .rv-star-group label { font-size: 1.8rem; cursor: pointer; color: #CBD5E1; transition: color 0.15s; }
            .rv-star-group label:hover,
            .rv-star-group label:hover ~ label,
            .rv-star-group input:checked ~ label { color: #F59E0B; }
            .rv-textarea {
                width: 100%; min-height: 90px; padding: 0.75rem 1rem;
                border: 1.5px solid #BAE6FD; border-radius: 10px; resize: vertical;
                font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #0C4A6E;
                background: #F0F9FF; outline: none; transition: border-color 0.2s;
                box-sizing: border-box;
            }
            .rv-textarea:focus { border-color: #0EA5E9; }
            .rv-submit {
                margin-top: 0.75rem; padding: 0.65rem 1.5rem;
                background: linear-gradient(135deg, #0EA5E9, #0284C7);
                color: white; border: none; border-radius: 999px;
                font-family: 'Inter', sans-serif; font-size: 0.875rem; font-weight: 600;
                cursor: pointer; transition: all 0.2s;
                box-shadow: 0 4px 12px rgba(14,165,233,0.3);
            }
            .rv-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(14,165,233,0.4); }
            .rv-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            .rv-login-prompt {
                text-align: center; padding: 1.25rem;
                background: #F0F9FF; border: 1.5px dashed #BAE6FD;
                border-radius: 12px; margin-bottom: 1.5rem;
                font-size: 0.875rem; color: #64748B;
            }
            .rv-login-prompt a {
                color: #0EA5E9; font-weight: 600; cursor: pointer; text-decoration: none;
            }
            .rv-form-error {
                margin-top: 0.5rem; font-size: 0.8rem; color: #DC2626;
                background: #FEF2F2; border: 1px solid #FECACA;
                padding: 0.5rem 0.75rem; border-radius: 8px; display: none;
            }

            /* Review cards */
            .rv-list { display: flex; flex-direction: column; gap: 1rem; }
            .rv-card {
                background: #fff; border: 1px solid #E0F2FE; border-radius: 14px;
                padding: 1.25rem; transition: box-shadow 0.2s;
                animation: rv-fadein 0.3s ease;
            }
            .rv-card:hover { box-shadow: 0 4px 20px rgba(14,165,233,0.1); }
            @keyframes rv-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
            .rv-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
            .rv-card-user { display: flex; align-items: center; gap: 0.625rem; }
            .rv-avatar {
                width: 34px; height: 34px; border-radius: 50%;
                background: linear-gradient(135deg, #0EA5E9, #0284C7);
                display: flex; align-items: center; justify-content: center;
                font-size: 1.05rem; flex-shrink: 0;
            }
            .rv-username { font-size: 0.875rem; font-weight: 600; color: #0C4A6E; }
            .rv-region { font-size: 0.72rem; color: #94A3B8; }
            .rv-card-meta { text-align: right; }
            .rv-card-stars { font-size: 0.95rem; }
            .rv-card-time { font-size: 0.72rem; color: #94A3B8; margin-top: 2px; }
            .rv-card-body { font-size: 0.875rem; color: #475569; line-height: 1.65; margin-top: 0.625rem; }
            .rv-delete-btn {
                font-size: 0.72rem; color: #DC2626; background: none; border: none;
                cursor: pointer; padding: 0; margin-top: 0.5rem; opacity: 0.6;
                transition: opacity 0.15s;
            }
            .rv-delete-btn:hover { opacity: 1; }
            .rv-empty {
                text-align: center; padding: 2rem; color: #94A3B8;
                font-size: 0.875rem; background: #F8FCFF; border-radius: 12px;
                border: 1.5px dashed #BAE6FD;
            }
            .rv-section-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 1rem;
            }
            .rv-section-title { font-size: 1.05rem; font-weight: 700; color: #0C4A6E; }
            .rv-count-badge {
                font-size: 0.75rem; font-weight: 600; color: #0EA5E9;
                background: rgba(14,165,233,0.1); padding: 0.2rem 0.65rem;
                border-radius: 999px;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Render summary bar ────────────────────────────────────────────────────
    function renderSummary(reviews) {
        if (!reviews.length) return '';
        const avg = calcAverage(reviews);
        const counts = [5, 4, 3, 2, 1].map(s => ({
            star: s,
            count: reviews.filter(r => r.rating === s).length
        }));
        const bars = counts.map(({ star, count }) => {
            const pct = reviews.length ? Math.round(count / reviews.length * 100) : 0;
            return `
                <div class="rv-bar-row">
                    <span style="width:10px;text-align:right;">${star}</span>
                    <span style="color:#F59E0B;font-size:0.8rem;">★</span>
                    <div class="rv-bar-track"><div class="rv-bar-fill" style="width:${pct}%"></div></div>
                    <span style="width:20px;">${count}</span>
                </div>`;
        }).join('');
        return `
            <div class="rv-summary">
                <div>
                    <div class="rv-avg-score">${avg}</div>
                    <div style="font-size:1.1rem;color:#F59E0B;margin:2px 0;">${renderStars(parseFloat(avg))}</div>
                    <div class="rv-avg-label">${reviews.length} đánh giá</div>
                </div>
                <div class="rv-bars">${bars}</div>
            </div>`;
    }

    // ─── Render single review card ────────────────────────────────────────────
    function renderCard(review, currentUser, destinationId, onDelete) {
        const isOwner = currentUser && currentUser.username === review.username;
        const starsHtml = [1, 2, 3, 4, 5].map(i =>
            `<span style="color:${i <= review.rating ? '#F59E0B' : '#CBD5E1'};">★</span>`
        ).join('');
        return `
            <div class="rv-card" id="rv-card-${review.id}">
                <div class="rv-card-header">
                    <div class="rv-card-user">
                        <div class="rv-avatar">${review.avatar || '🧑'}</div>
                        <div>
                            <div class="rv-username">${review.fullName}</div>
                            ${review.region ? `<div class="rv-region">📍 ${review.region}</div>` : ''}
                        </div>
                    </div>
                    <div class="rv-card-meta">
                        <div class="rv-card-stars">${starsHtml}</div>
                        <div class="rv-card-time">${timeAgo(review.createdAt)}</div>
                    </div>
                </div>
                ${review.body ? `<div class="rv-card-body">${review.body}</div>` : ''}
                ${isOwner ? `<button class="rv-delete-btn" onclick="(${onDelete})('${destinationId}','${review.id}')">🗑 Xóa đánh giá của tôi</button>` : ''}
            </div>`;
    }

    // ─── Mount widget ─────────────────────────────────────────────────────────
    function mount(destinationId, container) {
        if (!container) { console.warn(`[Reviews] container not found for: ${destinationId}`); return; }
        injectStyles();

        function render() {
            const user = getCurrentUser();
            const reviews = getReviews(destinationId);
            const starGroupId = `rv-stars-${destinationId}`;

            // Form or login prompt
            let formHtml = '';
            if (user) {
                // Check if user already reviewed
                const alreadyReviewed = reviews.find(r => r.username === user.username);
                if (alreadyReviewed) {
                    formHtml = `
                        <div class="rv-login-prompt">
                            ✅ Bạn đã đánh giá địa điểm này rồi.
                            <br><span style="font-size:0.78rem;color:#94A3B8;">Xóa đánh giá cũ để viết lại.</span>
                        </div>`;
                } else {
                    formHtml = `
                        <div class="rv-form-wrap">
                            <div class="rv-form-title">✍️ Viết đánh giá của bạn</div>
                            <div class="rv-star-group" id="${starGroupId}">
                                ${[5, 4, 3, 2, 1].map(i => `
                                    <input type="radio" id="${starGroupId}-s${i}" name="${starGroupId}" value="${i}">
                                    <label for="${starGroupId}-s${i}">★</label>
                                `).join('')}
                            </div>
                            <textarea class="rv-textarea" id="rv-body-${destinationId}" placeholder="Chia sẻ trải nghiệm của bạn về điểm đến này... (không bắt buộc)" maxlength="500"></textarea>
                            <div class="rv-form-error" id="rv-err-${destinationId}">Vui lòng chọn số sao trước khi gửi.</div>
                            <button class="rv-submit" onclick="Reviews._submit('${destinationId}')">Gửi đánh giá</button>
                        </div>`;
                }
            } else {
                formHtml = `
                    <div class="rv-login-prompt">
                        💬 <a onclick="typeof authShowModal==='function' && authShowModal('login')">Đăng nhập</a>
                        để viết đánh giá cho điểm đến này
                    </div>`;
            }

            // Cards
            const cardsHtml = reviews.length
                ? reviews.map(r => renderCard(r, user, destinationId, _handleDelete)).join('')
                : `<div class="rv-empty">😊 Chưa có đánh giá nào. Hãy là người đầu tiên!</div>`;

            container.innerHTML = `
                <div class="rv-root">
                    <div class="rv-section-header">
                        <div class="rv-section-title">Đánh giá của du khách</div>
                        ${reviews.length ? `<span class="rv-count-badge">${reviews.length} reviews</span>` : ''}
                    </div>
                    ${reviews.length >= 2 ? renderSummary(reviews) : ''}
                    ${formHtml}
                    <div class="rv-list">${cardsHtml}</div>
                </div>`;
        }

        // Register for re-render on login/logout
        const origUpdate = window.updateNavAuth;
        window.updateNavAuth = function () {
            if (origUpdate) origUpdate();
            render();
        };

        render();
    }

    // ─── Submit handler (needs global scope for inline onclick) ───────────────
    function _submit(destinationId) {
        const user = getCurrentUser();
        if (!user) { if (typeof authShowModal === 'function') authShowModal('login'); return; }

        const starGroupId = `rv-stars-${destinationId}`;
        const selected = document.querySelector(`input[name="${starGroupId}"]:checked`);
        const errEl = document.getElementById(`rv-err-${destinationId}`);
        errEl.style.display = 'none';

        if (!selected) { errEl.style.display = 'block'; return; }

        const rating = parseInt(selected.value);
        const body = (document.getElementById(`rv-body-${destinationId}`).value || '').trim();

        const review = {
            id: Date.now().toString(),
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar || '🧑',
            region: user.region || '',
            rating,
            body,
            createdAt: Date.now(),
        };

        addReview(destinationId, review);

        // Re-render this widget's container
        const container = document.querySelector(`[data-rv-id="${destinationId}"]`);
        if (container) mount(destinationId, container);

        // Toast (dùng showToast từ auth.js nếu có)
        if (typeof showToast === 'function') {
            showToast('🌟 Đánh giá của bạn đã được gửi!', 'success');
        }
    }

    function _handleDelete(destinationId, reviewId) {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
        deleteReview(destinationId, reviewId);
        const container = document.querySelector(`[data-rv-id="${destinationId}"]`);
        if (container) mount(destinationId, container);
        if (typeof showToast === 'function') showToast('🗑 Đã xóa đánh giá.', 'info');
    }

    // Public API
    return { mount, _submit, _handleDelete, getReviews, calcAverage };
})();

// ─── Auto-mount: tìm tất cả element có data-rv-id ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-rv-id]').forEach(el => {
        Reviews.mount(el.dataset.rvId, el);
    });
});