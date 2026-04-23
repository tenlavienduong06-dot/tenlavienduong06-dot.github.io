/**
 * PCCV ETOURISM — Auth Module v2 (fixed)
 * Fix 1: makeField() defined BEFORE MODAL_HTML template literal that calls it
 * Fix 2: Modal open/close uses style.display directly (not CSS class)
 */

var AUTH_KEY = 'pccv_current_user';
var REGISTERED_KEY = 'pccv_registered_users';

// ─── Mock users ───────────────────────────────────────────────────────────────
var MOCK_USERS = [
  { id:1, username:'nguyenvanA',  password:'Hanoi@2026',    fullName:'Nguyễn Văn An',   email:'nguyenvanan@gmail.com', phone:'0912345678', avatar:'🧑', region:'Hà Nội',           joinDate:'2024-01-15' },
  { id:2, username:'tranthib',    password:'Saigon@2026',   fullName:'Trần Thị Bình',   email:'tranthib@gmail.com',    phone:'0987654321', avatar:'👩', region:'TP. Hồ Chí Minh',  joinDate:'2024-02-20' },
  { id:3, username:'lehongC',     password:'Danang@2026',   fullName:'Lê Hồng Chiến',   email:'lehongc@gmail.com',     phone:'0934567890', avatar:'🧑', region:'Đà Nẵng',          joinDate:'2024-03-10' },
  { id:4, username:'phamthiD',    password:'Hue@2026',      fullName:'Phạm Thị Duyên',  email:'phamthid@gmail.com',    phone:'0956789012', avatar:'👩', region:'Cố đô Huế',        joinDate:'2024-04-05' },
  { id:5, username:'voquocE',     password:'Sapa@2026',     fullName:'Võ Quốc Đạt',     email:'voquoce@gmail.com',     phone:'0978901234', avatar:'🧑', region:'Sa Pa',             joinDate:'2024-05-18' },
  { id:6, username:'hoangmyF',    password:'Cantho@2026',   fullName:'Hoàng Mỹ Fến',    email:'hoangmyf@gmail.com',    phone:'0901234567', avatar:'👩', region:'Cần Thơ',          joinDate:'2024-06-22' },
  { id:7, username:'dinhminhG',   password:'Phuquoc@2026',  fullName:'Đinh Minh Giang', email:'dinhming@gmail.com',    phone:'0923456789', avatar:'🧑', region:'Phú Quốc',         joinDate:'2024-07-30' },
  { id:8, username:'ngothanhH',   password:'Ninhbinh@2026', fullName:'Ngô Thanh Hà',    email:'ngothanhh@gmail.com',   phone:'0945678901', avatar:'👩', region:'Ninh Bình',        joinDate:'2024-08-14' },
];

// ─── Core helpers ─────────────────────────────────────────────────────────────
function getAllUsers() {
  var registered = [];
  try { registered = JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]'); } catch(e){}
  return MOCK_USERS.concat(registered);
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch(e){ return null; }
}

function login(username, password) {
  var users = getAllUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      var session = Object.assign({}, users[i]);
      delete session.password;
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
  }
  return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
}

function register(data) {
  var users = getAllUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === data.username) return { success: false, error: 'Tên đăng nhập đã tồn tại.' };
    if (users[i].email    === data.email)    return { success: false, error: 'Email đã được sử dụng.' };
  }
  var registered = [];
  try { registered = JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]'); } catch(e){}
  var newUser = {
    id:       Date.now(),
    username: data.username,
    password: data.password,
    fullName: data.fullName,
    email:    data.email,
    phone:    data.phone || '',
    avatar:   data.gender === 'female' ? '👩' : '🧑',
    region:   data.region || '',
    joinDate: new Date().toISOString().split('T')[0],
  };
  registered.push(newUser);
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
  var session = Object.assign({}, newUser);
  delete session.password;
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true, user: session };
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// ─── FIX 1: makeField DEFINED HERE, before MODAL_HTML uses it ─────────────────
function makeField(id, type, hint, label) {
  return '<div style="margin-bottom:0.875rem;">' +
    '<label style="display:block;font-size:0.78rem;font-weight:600;color:#0C4A6E;margin-bottom:0.35rem;text-transform:uppercase;letter-spacing:0.05em;">' + label + '</label>' +
    '<input id="' + id + '" type="' + type + '" placeholder="' + hint + '"' +
    ' style="width:100%;padding:0.72rem 1rem;border:1.5px solid #BAE6FD;border-radius:10px;font-family:Inter,sans-serif;font-size:0.9rem;color:#0C4A6E;outline:none;background:#F0F9FF;box-sizing:border-box;"' +
    ' onfocus="this.style.borderColor=\'#0EA5E9\'" onblur="this.style.borderColor=\'#BAE6FD\'">' +
    '</div>';
}

// ─── Modal HTML (makeField is now safe to call here) ─────────────────────────
var MODAL_HTML = '' +
'<style>' +
'@keyframes authSlideIn{from{opacity:0;transform:translateY(18px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}' +
'#auth-modal{animation:authSlideIn 0.32s cubic-bezier(0.34,1.56,0.64,1);}' +
'</style>' +

'<div id="auth-overlay" style="display:none;position:fixed;inset:0;z-index:9000;background:rgba(8,28,50,0.65);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);align-items:center;justify-content:center;padding:1rem;">' +
  '<div id="auth-modal" style="position:relative;background:#fff;border-radius:20px;width:min(440px,calc(100vw - 2rem));max-height:92vh;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.3);display:flex;flex-direction:column;">' +

    '<!-- TABS -->' +
    '<div style="display:flex;border-bottom:1px solid #BAE6FD;background:#F0F9FF;flex-shrink:0;">' +
      '<button id="tab-login" onclick="authShowTab(\'login\')" style="flex:1;padding:1rem;border:none;border-bottom:2px solid #0EA5E9;background:transparent;font-family:Inter,sans-serif;font-size:0.9rem;font-weight:600;color:#0EA5E9;cursor:pointer;">Đăng nhập</button>' +
      '<button id="tab-register" onclick="authShowTab(\'register\')" style="flex:1;padding:1rem;border:none;border-bottom:2px solid transparent;background:transparent;font-family:Inter,sans-serif;font-size:0.9rem;font-weight:600;color:#94A3B8;cursor:pointer;">Đăng ký</button>' +
    '</div>' +

    '<!-- LOGIN PANE -->' +
    '<div id="auth-login-pane" style="padding:2rem;overflow-y:auto;">' +
      '<div style="text-align:center;margin-bottom:1.5rem;">' +
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;color:#0C4A6E;margin-bottom:0.25rem;">Chào mừng trở lại 👋</div>' +
        '<p style="font-size:0.85rem;color:#94A3B8;">Đăng nhập để tiếp tục khám phá Việt Nam</p>' +
      '</div>' +
      '<div id="login-error" style="display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:0.75rem 1rem;font-size:0.85rem;color:#DC2626;margin-bottom:1rem;"></div>' +
      makeField('login-username','text','Nhập tên đăng nhập','Tên đăng nhập') +
      '<div style="margin-bottom:1.5rem;">' +
        '<label style="display:block;font-size:0.78rem;font-weight:600;color:#0C4A6E;margin-bottom:0.35rem;text-transform:uppercase;letter-spacing:0.05em;">Mật khẩu</label>' +
        '<input id="login-password" type="password" placeholder="Nhập mật khẩu" style="width:100%;padding:0.72rem 1rem;border:1.5px solid #BAE6FD;border-radius:10px;font-family:Inter,sans-serif;font-size:0.9rem;color:#0C4A6E;outline:none;background:#F0F9FF;box-sizing:border-box;" onfocus="this.style.borderColor=\'#0EA5E9\'" onblur="this.style.borderColor=\'#BAE6FD\'" onkeydown="if(event.key===\'Enter\')authDoLogin()">' +
      '</div>' +
      '<button onclick="authDoLogin()" style="width:100%;padding:0.875rem;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;border:none;border-radius:10px;font-family:Inter,sans-serif;font-size:0.95rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(14,165,233,0.35);">Đăng nhập</button>' +
      '<div style="text-align:center;margin-top:1.25rem;font-size:0.84rem;color:#94A3B8;">Chưa có tài khoản? <a href="#" onclick="authShowTab(\'register\');return false;" style="color:#0EA5E9;font-weight:600;text-decoration:none;">Đăng ký ngay</a></div>' +
      '<div style="margin-top:1.25rem;padding:0.875rem;background:#F0F9FF;border-radius:10px;border:1px solid #BAE6FD;">' +
        '<div style="font-size:0.75rem;font-weight:600;color:#0C4A6E;margin-bottom:0.3rem;">💡 Tài khoản demo:</div>' +
        '<div style="font-size:0.78rem;color:#475569;font-family:monospace;">user: <b>nguyenvanA</b> &nbsp;|&nbsp; pass: <b>Hanoi@2026</b></div>' +
      '</div>' +
    '</div>' +

    '<!-- REGISTER PANE -->' +
    '<div id="auth-register-pane" style="display:none;padding:2rem;overflow-y:auto;">' +
      '<div style="text-align:center;margin-bottom:1.5rem;">' +
        '<div style="font-family:\'Playfair Display\',Georgia,serif;font-size:1.5rem;font-weight:700;color:#0C4A6E;margin-bottom:0.25rem;">Tạo tài khoản mới ✨</div>' +
        '<p style="font-size:0.85rem;color:#94A3B8;">Tham gia cộng đồng khám phá Việt Nam</p>' +
      '</div>' +
      '<div id="register-error" style="display:none;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:0.75rem 1rem;font-size:0.85rem;color:#DC2626;margin-bottom:1rem;"></div>' +
      makeField('register-fullname','text','Nguyễn Văn An','Họ và tên *') +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;">' +
        makeField('register-username','text','vd: nguyenvana','Tên đăng nhập *') +
        makeField('register-phone','tel','0912345678','Số điện thoại') +
      '</div>' +
      makeField('register-email','email','email@gmail.com','Email *') +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;">' +
        makeField('register-password','password','Tối thiểu 6 ký tự','Mật khẩu *') +
        makeField('register-password2','password','Nhập lại mật khẩu','Xác nhận *') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;margin-bottom:1.5rem;">' +
        '<div><label style="display:block;font-size:0.78rem;font-weight:600;color:#0C4A6E;margin-bottom:0.35rem;text-transform:uppercase;">Giới tính</label>' +
        '<select id="register-gender" style="width:100%;padding:0.72rem 1rem;border:1.5px solid #BAE6FD;border-radius:10px;font-family:Inter,sans-serif;font-size:0.9rem;color:#0C4A6E;background:#F0F9FF;outline:none;box-sizing:border-box;">' +
          '<option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option>' +
        '</select></div>' +
        '<div><label style="display:block;font-size:0.78rem;font-weight:600;color:#0C4A6E;margin-bottom:0.35rem;text-transform:uppercase;">Khu vực</label>' +
        '<select id="register-region" style="width:100%;padding:0.72rem 1rem;border:1.5px solid #BAE6FD;border-radius:10px;font-family:Inter,sans-serif;font-size:0.9rem;color:#0C4A6E;background:#F0F9FF;outline:none;box-sizing:border-box;">' +
          '<option value="">Chọn khu vực</option>' +
          '<option>Hà Nội</option><option>TP. Hồ Chí Minh</option><option>Đà Nẵng</option>' +
          '<option>Cố đô Huế</option><option>Sa Pa</option><option>Cần Thơ</option>' +
          '<option>Phú Quốc</option><option>Ninh Bình</option><option>Hạ Long</option><option>Khác</option>' +
        '</select></div>' +
      '</div>' +
      '<button onclick="authDoRegister()" style="width:100%;padding:0.875rem;background:linear-gradient(135deg,#059669,#047857);color:white;border:none;border-radius:10px;font-family:Inter,sans-serif;font-size:0.95rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(5,150,105,0.35);">Tạo tài khoản</button>' +
      '<div style="text-align:center;margin-top:1rem;font-size:0.84rem;color:#94A3B8;">Đã có tài khoản? <a href="#" onclick="authShowTab(\'login\');return false;" style="color:#0EA5E9;font-weight:600;text-decoration:none;">Đăng nhập</a></div>' +
    '</div>' +

    '<!-- CLOSE -->' +
    '<button onclick="authCloseModal()" style="position:absolute;top:0.875rem;right:0.875rem;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,0.07);border:none;cursor:pointer;font-size:1rem;color:#64748B;display:flex;align-items:center;justify-content:center;z-index:10;" onmouseover="this.style.background=\'rgba(0,0,0,0.15)\';this.style.transform=\'rotate(90deg)\'" onmouseout="this.style.background=\'rgba(0,0,0,0.07)\';this.style.transform=\'\'">✕</button>' +
  '</div>' +
'</div>';

// ─── FIX 2: open/close modal via style.display (avoids inline-style override) ─
window.authShowModal = function(tab) {
  var overlay = document.getElementById('auth-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  authShowTab(tab || 'login');
};

window.authCloseModal = function() {
  var overlay = document.getElementById('auth-overlay');
  if (overlay) overlay.style.display = 'none';
};

window.authShowTab = function(tab) {
  var lp = document.getElementById('auth-login-pane');
  var rp = document.getElementById('auth-register-pane');
  var tl = document.getElementById('tab-login');
  var tr = document.getElementById('tab-register');
  if (!lp) return;
  if (tab === 'login') {
    lp.style.display='block'; rp.style.display='none';
    tl.style.color='#0EA5E9'; tl.style.borderBottom='2px solid #0EA5E9';
    tr.style.color='#94A3B8'; tr.style.borderBottom='2px solid transparent';
  } else {
    lp.style.display='none'; rp.style.display='block';
    tr.style.color='#0EA5E9'; tr.style.borderBottom='2px solid #0EA5E9';
    tl.style.color='#94A3B8'; tl.style.borderBottom='2px solid transparent';
  }
};

window.authDoLogin = function() {
  var username = (document.getElementById('login-username').value||'').trim();
  var password =  document.getElementById('login-password').value||'';
  var errorEl  =  document.getElementById('login-error');
  errorEl.style.display = 'none';
  if (!username || !password) {
    errorEl.textContent = 'Vui lòng điền đầy đủ thông tin.';
    errorEl.style.display = 'block'; return;
  }
  var result = login(username, password);
  if (result.success) {
    authCloseModal();
    updateNavAuth();
    showToast('🎉 Chào mừng, ' + result.user.fullName + '!', 'success');
  } else {
    errorEl.textContent = result.error;
    errorEl.style.display = 'block';
  }
};

window.authDoRegister = function() {
  var fn  = (document.getElementById('register-fullname').value||'').trim();
  var un  = (document.getElementById('register-username').value||'').trim();
  var em  = (document.getElementById('register-email').value||'').trim();
  var ph  = (document.getElementById('register-phone').value||'').trim();
  var pw  =  document.getElementById('register-password').value||'';
  var pw2 =  document.getElementById('register-password2').value||'';
  var gen =  document.getElementById('register-gender').value;
  var reg =  document.getElementById('register-region').value;
  var errorEl = document.getElementById('register-error');
  errorEl.style.display = 'none';
  if (!fn||!un||!em||!pw){ errorEl.textContent='Vui lòng điền đầy đủ các trường bắt buộc (*).'; errorEl.style.display='block'; return; }
  if (pw.length<6)        { errorEl.textContent='Mật khẩu phải có ít nhất 6 ký tự.';            errorEl.style.display='block'; return; }
  if (pw!==pw2)           { errorEl.textContent='Mật khẩu xác nhận không khớp.';                errorEl.style.display='block'; return; }
  var result = register({fullName:fn,username:un,email:em,phone:ph,password:pw,gender:gen,region:reg});
  if (result.success) {
    authCloseModal();
    updateNavAuth();
    showToast('✨ Đăng ký thành công! Chào mừng ' + result.user.fullName + '!', 'success');
  } else {
    errorEl.textContent = result.error;
    errorEl.style.display = 'block';
  }
};

window.authLogout = function() {
  logout();
  updateNavAuth();
  showToast('👋 Đã đăng xuất. Hẹn gặp lại!', 'info');
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type) {
  var old = document.getElementById('auth-toast');
  if (old) old.remove();
  var t = document.createElement('div');
  t.id = 'auth-toast';
  var bg = (type==='success') ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#0EA5E9,#0284C7)';
  t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:'+bg+';color:white;padding:0.875rem 1.5rem;border-radius:12px;font-family:Inter,sans-serif;font-size:0.9rem;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:99999;opacity:0;transition:all 0.35s ease;white-space:nowrap;pointer-events:none;';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(12px)'; setTimeout(function(){ if(t.parentNode) t.remove(); },400); },3000);
}

// ─── Nav updater ──────────────────────────────────────────────────────────────
function updateNavAuth() {
  var user = getCurrentUser();
  var btn  = document.getElementById('auth-nav-btn');
  if (!btn) return;
  if (user) {
    btn.innerHTML =
      '<div id="auth-avatar-wrap" style="position:relative;display:inline-block;">' +
        '<button onclick="authToggleDropdown(event)" style="display:flex;align-items:center;gap:0.5rem;background:rgba(14,165,233,0.1);border:1.5px solid rgba(14,165,233,0.3);padding:0.4rem 0.875rem 0.4rem 0.5rem;border-radius:999px;cursor:pointer;font-family:Inter,sans-serif;font-size:0.88rem;font-weight:600;color:#0C4A6E;">' +
          '<span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#0EA5E9,#0284C7);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;">'+(user.avatar||'🧑')+'</span>' +
          '<span style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+user.fullName.split(' ').pop()+'</span>' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="#0C4A6E"><path d="M7 10l5 5 5-5z"/></svg>' +
        '</button>' +
        '<div id="auth-dropdown" style="display:none;position:absolute;top:calc(100% + 8px);right:0;background:white;border:1px solid #BAE6FD;border-radius:12px;box-shadow:0 8px 32px rgba(14,165,233,0.18);min-width:210px;overflow:hidden;z-index:9100;">' +
          '<div style="padding:0.875rem 1rem;border-bottom:1px solid #E0F2FE;background:#F0F9FF;">' +
            '<div style="font-size:1.2rem;margin-bottom:0.2rem;">'+(user.avatar||'🧑')+'</div>' +
            '<div style="font-size:0.9rem;font-weight:600;color:#0C4A6E;">'+user.fullName+'</div>' +
            '<div style="font-size:0.75rem;color:#94A3B8;">@'+user.username+'</div>' +
            (user.region ? '<div style="font-size:0.75rem;color:#0EA5E9;margin-top:0.2rem;">📍 '+user.region+'</div>' : '') +
          '</div>' +
          '<div style="padding:0.5rem;">' +
            '<button onclick="authLogout()" style="width:100%;display:flex;align-items:center;gap:0.625rem;padding:0.625rem 0.875rem;border:none;background:transparent;border-radius:8px;font-family:Inter,sans-serif;font-size:0.875rem;color:#DC2626;cursor:pointer;text-align:left;font-weight:500;" onmouseover="this.style.background=\'#FEF2F2\'" onmouseout="this.style.background=\'transparent\'">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="#DC2626"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>' +
              'Đăng xuất' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  } else {
    btn.innerHTML =
      '<button onclick="authShowModal(\'login\')" style="display:flex;align-items:center;gap:0.4rem;background:linear-gradient(135deg,#0EA5E9,#0284C7);color:white;border:none;padding:0.5rem 1.25rem;border-radius:999px;font-family:Inter,sans-serif;font-size:0.875rem;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(14,165,233,0.35);">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' +
        'Đăng nhập' +
      '</button>';
  }
}

window.authToggleDropdown = function(e) {
  e.stopPropagation();
  var dd = document.getElementById('auth-dropdown');
  if (dd) dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
};

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Inject modal
  var wrap = document.createElement('div');
  wrap.innerHTML = MODAL_HTML;
  document.body.appendChild(wrap);

  // Backdrop click closes modal
  var overlay = document.getElementById('auth-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) authCloseModal();
    });
  }

  // Outside click closes dropdown
  document.addEventListener('click', function() {
    var dd = document.getElementById('auth-dropdown');
    if (dd) dd.style.display = 'none';
  });

  // Escape closes modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') authCloseModal();
  });

  // Activate auth nav button
  var placeholder = document.getElementById('auth-nav-placeholder');
  if (placeholder) {
    placeholder.id = 'auth-nav-btn';
    updateNavAuth();
  }
});