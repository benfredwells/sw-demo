const images = [
    'imgs/1.png', 'imgs/2.png', 'imgs/3.png', 'imgs/4.png', 'imgs/5.png',
    'imgs/6.png', 'imgs/7.png', 'imgs/8.png', 'imgs/9.png', 'imgs/10.png', 'imgs/11.png'
];

const fonts = [
    { name: 'Canva Sans', class: 'font-canva-sans' },
    { name: 'Canva Sans Extra', class: 'font-canva-extra' },
    { name: 'HelloFont ChuYuan 65', class: 'font-chuyuan-65' },
    { name: 'HelloFont CangLan', class: 'font-canglan' },
    { name: 'MaShanZheng', class: 'font-mashanzheng' },
    { name: 'HelloFont MoQu', class: 'font-moqu' },
    { name: 'LongCang', class: 'font-longcang' },
    { name: 'SourceHanSerif SC', class: 'font-sourcehan' },
    { name: 'ZCOOLXiaoWei', class: 'font-zcool' },
    { name: 'LiuJianMaoCao', class: 'font-liujian' },
    { name: 'ZhiMangXing', class: 'font-zhimang' },
    { name: 'Bold Regular', class: 'font-bold-regular' },
    { name: 'Heavy Regular', class: 'font-heavy-regular' },
    { name: 'HelloFont ChuYuan 75', class: 'font-chuyuan-75' },
    { name: 'HelloFont ChuYuan 45', class: 'font-chuyuan-45' },
    { name: 'HelloFont FangZhuan 35', class: 'font-fangzhuan-35' },
    { name: 'HelloFont LieHei 65', class: 'font-liehei-65' },
    { name: 'HelloFont LingLong', class: 'font-linglong' },
    { name: 'IwaTxt Eb', class: 'font-iwatxt-eb' },
    { name: 'IwaTxt Bd', class: 'font-iwatxt-bd' }
];

const textSamples = [
    '设计让生活更美好',
    'Empower the world to design',
    'デザインで世界を変える',
    '创意无限可能',
    'Unlimited creativity',
    '简单易用的设计工具',
    'Professional Design',
    '赋能世界去设计',
    'Design made simple',
    '视觉设计的力量',
    'Create amazing content',
    '打造精彩内容',
    'Typography Excellence',
    '书法艺术',
    'Visual Impact'
];

////////////////////////////////////////////////////////////
// Element adding logic

function addImageToCanvas() {
    const canvas = document.getElementById('designCanvas');
    const img = document.createElement('img');
    const randomImage = images[Math.floor(Math.random() * images.length)];

    img.src = randomImage;
    img.className = 'canvas-image';

    const wrapper = document.createElement('div');
    wrapper.className = 'canvas-element';
    wrapper.style.left = Math.random() * 70 + '%';
    wrapper.style.top = Math.random() * 70 + '%';
    wrapper.style.width = (150 + Math.random() * 200) + 'px';
    wrapper.style.zIndex = Math.floor(Math.random() * 50);

    wrapper.appendChild(img);
    canvas.appendChild(wrapper);
}

function addTextToCanvas() {
    const canvas = document.getElementById('designCanvas');
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomText = textSamples[Math.floor(Math.random() * textSamples.length)];

    const textDiv = document.createElement('div');
    textDiv.className = 'canvas-element canvas-text ' + randomFont.class;
    textDiv.textContent = randomText;
    textDiv.style.left = Math.random() * 70 + '%';
    textDiv.style.top = Math.random() * 70 + '%';
    textDiv.style.fontSize = (16 + Math.random() * 24) + 'px';
    textDiv.style.zIndex = Math.floor(Math.random() * 50);
    textDiv.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);

    canvas.appendChild(textDiv);
}

let elementCount = 0;
function addToElementCount(count) {
    const elementCountEl = document.getElementById('elementCount');
    elementCount += count;

    if (elementCountEl) {
        elementCountEl.textContent = elementCount;
    }
}

// Adjust elements to match target count
function addElementsToCanvas(count) {
    console.log(`Adding ${count} elements.`);

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (Math.random() > 0.4) {
                addImageToCanvas();
            } else {
                addTextToCanvas();
            }
            addToElementCount(1);
        }, i * 30);
    }
}

////////////////////////////////////////////////////////////
// UI handlers

let toAddCount = 100;

function updateTargetDisplay() {
    const display = document.getElementById('targetElementCount');
    if (display) {
        display.textContent = toAddCount;
    }
}

function increaseElements() {
    toAddCount += 50;
    updateTargetDisplay();
}

function decreaseElements() {
    toAddCount = Math.max(0, toAddCount - 50);
    updateTargetDisplay();
}

function addElements() {
    addElementsToCanvas(toAddCount);
}

////////////////////////////////////////////////////////////
// Service Worker logic

let sw_enabled;

async function updateSWStatus() {
    const statusText = document.getElementById('swStatusText');
    const statusIndicator = document.getElementById('swStatusIndicator');
    const toggle = document.getElementById('swToggle');

    if (!('serviceWorker' in navigator)) {
        statusText.textContent = 'Service Worker not supported';
        statusIndicator.className = 'status-indicator inactive';
        toggle.disabled = true;
        sw_enabled = false
        return;
    }

    sw_enabled = navigator.serviceWorker.controller != null;

    if (sw_enabled) {
        statusText.textContent = 'Controlled';
        statusIndicator.className = 'status-indicator active';
    } else {
        statusText.textContent = 'Not controlled';
        statusIndicator.className = 'status-indicator inactive';
    }

    toggle.checked = sw_enabled;
}

async function toggleServiceWorker(enable) {
    if (enable == sw_enabled) {
        return;
    }

    if (!('serviceWorker' in navigator)) {
        alert('Service Worker is not supported in this browser');
        return;
    }

    if (enable) {
        // Enable Service Worker
        const swScript = 'sw.js';
        try {
            const registration = await navigator.serviceWorker.register(swScript);
            console.log('Service Worker registered with scope:', registration.scope);
            console.log('Service Worker script:', swScript);
            console.log('Service Worker will be fully functional after page reload...');

            // Update status to show it's pending
            const statusText = document.getElementById('swStatusText');
            if (statusText) {
                statusText.textContent = 'Reloading...';
            }

            // Reload after a short delay to allow SW to register
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            alert('Failed to register Service Worker: ' + error.message);
            updateSWStatus();
        }
    } else {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.unregister();
                console.log('Service Worker unregistered');
                // Reload the page to complete the unregistration
                window.location.reload();
            }
        } catch (error) {
            console.error('Service Worker unregistration failed:', error);
            alert('Failed to unregister Service Worker: ' + error.message);
            updateSWStatus();
        }
    }
}

// Handle toggle change
function handleToggleChange(event) {
    toggleServiceWorker(event.target.checked);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSWStatus);
} else {
    updateSWStatus();
}
