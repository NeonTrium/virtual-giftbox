const presets = {
    birthday: {
        name: 'Birthday',
        font: 'Outfit',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxColor: '#ff6b9d',
        ribbonColor: '#ffd700',
        letterBg: '#fff5e6',
        particleType: 'confetti',
        accentColor: '#ff6b9d'
    },
    anniversary: {
        name: 'Anniversary',
        font: 'Crimson Pro',
        bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        boxColor: '#d4145a',
        ribbonColor: '#ffd700',
        letterBg: '#fff0f5',
        particleType: 'hearts',
        accentColor: '#d4145a'
    },
    love: {
        name: 'Love Letter',
        font: 'Playfair Display',
        bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        boxColor: '#ff4d6d',
        ribbonColor: '#ffffff',
        letterBg: '#fffaf0',
        particleType: 'hearts',
        accentColor: '#ff4d6d'
    },
    sorry: {
        name: 'Sorry',
        font: 'Inter',
        bgGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        boxColor: '#70a1d7',
        ribbonColor: '#ffffff',
        letterBg: '#f0f8ff',
        particleType: 'snow',
        accentColor: '#70a1d7'
    },
    festive: {
        name: 'Festive',
        font: 'Lora',
        bgGradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        boxColor: '#c41e3a',
        ribbonColor: '#2d5016',
        letterBg: '#fffef7',
        particleType: 'snow',
        accentColor: '#c41e3a'
    },
    none: {
        name: 'No Occasion',
        font: 'Work Sans',
        bgGradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        boxColor: '#6c757d',
        ribbonColor: '#ffffff',
        letterBg: '#ffffff',
        particleType: 'glitter',
        accentColor: '#6c757d'
    }
};

let state = {
    preset: 'birthday',
    recipientName: '',
    gifterName: '',
    occasionDate: '',
    imageData: null,
    letterText: '',
    particleType: 'confetti',
    particleDensity: 50,
    particleSpeed: 5,
    glassTint: '#ffffff',
    customFont: '',
    audioData: null,
};

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initPresets();
    initInputs();
    initImageUpload();
    initAudioUpload();
    initModals();
    initGenerate();
});

function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = saved;

    toggle.addEventListener('click', () => {
        const current = document.body.dataset.theme;
        const next = current === 'light' ? 'dark' : 'light';
        document.body.dataset.theme = next;
        localStorage.setItem('theme', next);
    });
}

function initPresets() {
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.preset = btn.dataset.preset;
            const preset = presets[state.preset];
            document.getElementById('particleType').value = preset.particleType;
            state.particleType = preset.particleType;
            updatePreview();
        });
    });
}

function initInputs() {
    document.getElementById('recipientName').addEventListener('input', e => {
        state.recipientName = e.target.value;
        updatePreview();
    });

    document.getElementById('gifterName').addEventListener('input', e => {
        state.gifterName = e.target.value;
        updatePreview();
    });

    const letterTextarea = document.getElementById('letterText');
    letterTextarea.addEventListener('input', e => {
        state.letterText = e.target.value;
        document.querySelector('.char-count').textContent = `${e.target.value.length} / 2000`;
        updatePreview();
    });

    initCustomSelect('particleType', [
        { label: 'Snow', value: 'snow' },
        { label: 'Glitter', value: 'glitter' },
        { label: 'Hearts', value: 'hearts' },
        { label: 'Confetti', value: 'confetti' }
    ], value => {
        state.particleType = value;
        updatePreview();
    });

    document.getElementById('particleDensity').addEventListener('input', e => {
        state.particleDensity = parseInt(e.target.value);
        updatePreview();
    });

    document.getElementById('particleSpeed').addEventListener('input', e => {
        state.particleSpeed = parseInt(e.target.value);
        updatePreview();
    });

    initColorPicker('glassTint', state.glassTint, color => {
        state.glassTint = color;
        updatePreview();
    });

    document.getElementById('customFont').addEventListener('input', e => {
        state.customFont = e.target.value;
        updatePreview();
    });

    initDatePicker();
}

function initDatePicker() {
    const picker = document.getElementById('datePicker');
    const display = document.getElementById('dateDisplay');
    const dropdown = document.getElementById('dateDropdown');

    let current = new Date();

    function renderCalendar() {
        dropdown.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const label = document.createElement('div');
        label.textContent = current.toLocaleString('en-US', { month: 'long', year: 'numeric' });

        const prev = document.createElement('button');
        prev.textContent = '‹';
        prev.onclick = e => {
            e.stopPropagation();
            current.setMonth(current.getMonth() - 1);
            renderCalendar();
        };

        const next = document.createElement('button');
        next.textContent = '›';
        next.onclick = e => {
            e.stopPropagation();
            current.setMonth(current.getMonth() + 1);
            renderCalendar();
        };

        header.append(prev, label, next);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        const first = new Date(current.getFullYear(), current.getMonth(), 1);
        const offset = first.getDay();

        for (let i = 0; i < offset; i++) grid.appendChild(document.createElement('div'));

        const days = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
        for (let d = 1; d <= days; d++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-day';
            cell.textContent = d;
            cell.onclick = () => {
                const sel = new Date(current.getFullYear(), current.getMonth(), d);
                state.occasionDate = sel.toISOString().slice(0, 10);
                display.textContent = sel.toLocaleDateString();
                dropdown.classList.remove('open');
                updatePreview();
            };
            grid.appendChild(cell);
        }

        dropdown.append(header, grid);
    }

    display.onclick = () => {
        dropdown.classList.toggle('open');
        renderCalendar();
    };

    document.addEventListener('click', e => {
        if (!picker.contains(e.target)) dropdown.classList.remove('open');
    });
}

function initCustomSelect(id, options, onChange) {
    const originalSelect = document.getElementById(id);
    const label = originalSelect.previousElementSibling;
    const container = originalSelect.parentElement;
    
    originalSelect.style.display = 'none';

    const customSelect = document.createElement('div');
    customSelect.className = 'custom-select';

    const currentOption = options.find(o => o.value === originalSelect.value) || options[0];

    const display = document.createElement('div');
    display.className = 'select-display';
    
    const displayText = document.createElement('span');
    displayText.textContent = currentOption.label;
    
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('class', 'select-arrow');
    arrow.setAttribute('viewBox', '0 0 12 12');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M6 9L1 4h10z');
    arrow.appendChild(path);
    
    display.appendChild(displayText);
    display.appendChild(arrow);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'select-options';

    options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'select-option';
        if (option.value === currentOption.value) {
            optionEl.classList.add('selected');
        }
        optionEl.textContent = option.label;
        optionEl.addEventListener('click', e => {
            e.stopPropagation();
            displayText.textContent = option.label;
            optionsContainer.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
            optionEl.classList.add('selected');
            display.classList.remove('open');
            optionsContainer.classList.remove('open');
            originalSelect.value = option.value;
            onChange(option.value);
        });
        optionsContainer.appendChild(optionEl);
    });

    display.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = display.classList.contains('open');
        document.querySelectorAll('.select-display.open').forEach(el => {
            el.classList.remove('open');
            el.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
            display.classList.add('open');
            optionsContainer.classList.add('open');
        }
    });

    document.addEventListener('click', () => {
        display.classList.remove('open');
        optionsContainer.classList.remove('open');
    });

    customSelect.appendChild(display);
    customSelect.appendChild(optionsContainer);
    
    if (label && label.tagName === 'LABEL') {
        label.parentElement.insertBefore(customSelect, label.nextSibling);
    } else {
        container.appendChild(customSelect);
    }
}

function initColorPicker(id, initialColor, onChange) {
    const originalInput = document.getElementById(id);
    const label = originalInput.previousElementSibling;
    const container = originalInput.parentElement;
    
    originalInput.style.display = 'none';

    const customPicker = document.createElement('div');
    customPicker.className = 'custom-color-picker';

    const display = document.createElement('div');
    display.className = 'color-display';
    const displayInner = document.createElement('div');
    displayInner.className = 'color-display-inner';
    displayInner.style.background = initialColor;
    display.appendChild(displayInner);

    const modal = document.createElement('div');
    modal.className = 'color-picker-modal';

    const canvas = document.createElement('canvas');
    canvas.className = 'color-canvas';
    canvas.width = 300;
    canvas.height = 200;

    const hueSlider = document.createElement('div');
    hueSlider.className = 'color-hue';

    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'color-canvas-wrap';
    canvasWrap.appendChild(canvas);
    modal.appendChild(canvasWrap);

    const pointer = document.createElement('div');
    pointer.className = 'color-pointer';
    canvasWrap.appendChild(pointer);

    const hueThumb = document.createElement('div');
    hueThumb.className = 'color-hue-thumb';
    hueSlider.appendChild(hueThumb);

    const previewRow = document.createElement('div');
    previewRow.className = 'color-preview-row';

    const previewBox = document.createElement('div');
    previewBox.className = 'color-preview-box';
    previewBox.style.background = initialColor;

    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.className = 'color-hex-input';
    hexInput.value = initialColor.toUpperCase();
    hexInput.placeholder = '#FFFFFF';

    previewRow.appendChild(previewBox);
    previewRow.appendChild(hexInput);

    modal.appendChild(canvas);
    modal.appendChild(hueSlider);
    modal.appendChild(previewRow);

    customPicker.appendChild(display);
    customPicker.appendChild(modal);
    
    if (label && label.tagName === 'LABEL') {
        label.parentElement.insertBefore(customPicker, label.nextSibling);
    } else {
        container.appendChild(customPicker);
    }

    let currentHue = 0;
    let saturation = 1;
    let brightness = 1;

    function hexToHsv(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
            if (max === r) h = 60 * (((g - b) / diff) % 6);
            else if (max === g) h = 60 * ((b - r) / diff + 2);
            else h = 60 * ((r - g) / diff + 4);
        }
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : diff / max;
        const v = max;
        
        return { h, s, v };
    }

    function hsvToHex(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const hsv = hexToHsv(initialColor);
    currentHue = hsv.h;
    saturation = hsv.s;
    brightness = hsv.v;

    function drawCanvas() {
        const ctx = canvas.getContext('2d');
        const hueColor = hsvToHex(currentHue, 1, 1);
        
        const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradientH.addColorStop(0, '#ffffff');
        gradientH.addColorStop(1, hueColor);
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientV.addColorStop(0, 'rgba(0,0,0,0)');
        gradientV.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawCanvas();

    display.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = modal.classList.contains('open');
        document.querySelectorAll('.color-picker-modal.open').forEach(m => m.classList.remove('open'));
        if (!isOpen) {
            modal.classList.add('open');
        }
    });

    document.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', e => e.stopPropagation());

    canvas.addEventListener('click', e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        saturation = Math.max(0, Math.min(1, x / rect.width));
        brightness = Math.max(0, Math.min(1, 1 - (y / rect.height)));
        const color = hsvToHex(currentHue, saturation, brightness);
        updateColor(color);
    });

    hueSlider.addEventListener('click', e => {
        const rect = hueSlider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        currentHue = Math.max(0, Math.min(360, (x / rect.width) * 360));
        drawCanvas();
        const color = hsvToHex(currentHue, saturation, brightness);
        updateColor(color);
    });

    hexInput.addEventListener('input', e => {
        let value = e.target.value.toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        hexInput.value = value;
        if (/^#[0-9A-F]{6}$/.test(value)) {
            const hsv = hexToHsv(value);
            currentHue = hsv.h;
            saturation = hsv.s;
            brightness = hsv.v;
            drawCanvas();
            updateColor(value);
        }
        updatePointers();
    });

    hexInput.addEventListener('blur', e => {
        let value = hexInput.value;
        if (!/^#[0-9A-F]{6}$/.test(value)) {
            hexInput.value = originalInput.value.toUpperCase();
        }
    });

    function updateColor(color) {
        const upperColor = color.toUpperCase();
        previewBox.style.background = upperColor;
        displayInner.style.background = upperColor;
        hexInput.value = upperColor;
        originalInput.value = upperColor;
        onChange(upperColor);
    }

    updatePointers();

    let draggingSV = false;

    canvas.addEventListener('pointerdown', e => {
        draggingSV = true;
        canvas.setPointerCapture(e.pointerId);
        handleSV(e);
    });

    canvas.addEventListener('pointermove', e => {
        if (!draggingSV) return;
        handleSV(e);
    });

    window.addEventListener('pointerup', () => draggingSV = false);

    function handleSV(e) {
        const r = canvas.getBoundingClientRect();
        saturation = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        brightness = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
        updateColor(hsvToHex(currentHue, saturation, brightness));
        updatePointers();
    }

    let draggingHue = false;

    hueSlider.addEventListener('pointerdown', e => {
        draggingHue = true;
        hueSlider.setPointerCapture(e.pointerId);
        handleHue(e);
    });

    window.addEventListener('pointermove', e => {
        if (!draggingHue) return;
        handleHue(e);
    });

    window.addEventListener('pointerup', () => draggingHue = false);

    function handleHue(e) {
        const r = hueSlider.getBoundingClientRect();
        currentHue = Math.max(0, Math.min(360, ((e.clientX - r.left) / r.width) * 360));
        drawCanvas();
        updateColor(hsvToHex(currentHue, saturation, brightness));
        updatePointers();
    }

    pointer.addEventListener('pointerdown', e => {
    e.stopPropagation();
    draggingSV = true;
    pointer.setPointerCapture(e.pointerId);
    });

    window.addEventListener('pointerup', () => draggingSV = false);

    function updatePointers() {
        pointer.style.left = `${saturation * canvas.clientWidth}px`;
        pointer.style.top = `${(1 - brightness) * canvas.clientHeight}px`;
        hueThumb.style.left = `${(currentHue / 360) * hueSlider.clientWidth}px`;
    }

}

function initImageUpload() {
    const uploadZone = document.getElementById('imageUpload');
    const input = document.getElementById('imageInput');

    uploadZone.addEventListener('click', () => input.click());

    uploadZone.addEventListener('dragover', e => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--accent)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'var(--border)';
    });

    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });

    input.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
}

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            if (img.width < 512 || img.height < 512) {
                alert('Image must be at least 512×512 pixels');
                return;
            }
            showCropModal(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function showCropModal(img) {
    const modal = document.getElementById('cropModal');
    const content = modal.querySelector('.modal-inner');
    let cropStage = document.getElementById('cropStage');
    const existingCanvas = document.getElementById('cropCanvas');
    const existingZoom = document.getElementById('cropZoom');
    const confirmBtn = document.getElementById('cropConfirm');

    if (!cropStage) {
        cropStage = document.createElement('div');
        cropStage.id = 'cropStage';
        cropStage.className = 'crop-stage';
        const canvasWrap = document.createElement('div');
        canvasWrap.className = 'crop-canvas-wrap';
        canvasWrap.appendChild(existingCanvas);
        cropStage.appendChild(canvasWrap);
        const frame = document.createElement('div');
        frame.id = 'cropFrame';
        frame.className = 'crop-frame';
        cropStage.appendChild(frame);
        const old = content.querySelector('.crop-container');
        if (old) old.replaceWith(cropStage);
        else content.insertBefore(cropStage, content.firstChild.nextSibling);
    }

    const canvas = document.getElementById('cropCanvas');
    const zoom = existingZoom;
    const frame = document.getElementById('cropFrame');
    const wrap = cropStage.querySelector('.crop-canvas-wrap');

    const dpr = window.devicePixelRatio || 1;
    const innerPadding = 48;
    const contentAvailableW = Math.max(320, content.clientWidth - innerPadding);
    const maxViewport = {
        w: Math.round(Math.min(window.innerWidth * 0.78, contentAvailableW)),
        h: Math.round(window.innerHeight * 0.7)
    };

    const fitScale = Math.min(maxViewport.w / img.width, maxViewport.h / img.height, 1);
    const dispW = Math.round(img.width * fitScale);
    const dispH = Math.round(img.height * fitScale);

    wrap.style.width = dispW + 'px';
    wrap.style.height = dispH + 'px';
    wrap.style.maxWidth = '100%';
    wrap.style.boxSizing = 'border-box';

    canvas.style.width = dispW + 'px';
    canvas.style.height = dispH + 'px';
    canvas.width = Math.round(dispW * dpr);
    canvas.height = Math.round(dispH * dpr);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let baseScale = fitScale;
    let imgScale = baseScale;
    let imgX = (dispW - img.width * imgScale) / 2;
    let imgY = (dispH - img.height * imgScale) / 2;

    const frameSize = Math.round(Math.min(dispW, dispH) * 0.78);
    frame.style.width = frame.style.height = frameSize + 'px';
    frame.style.left = '50%';
    frame.style.top = '50%';
    frame.style.transform = 'translate(-50%,-50%)';

    const controls = modal.querySelector('.crop-controls');
    if (controls) {
        controls.style.position = 'relative';
        controls.style.zIndex = 10050;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.save();
        ctx.translate(imgX, imgY);
        ctx.scale(imgScale, imgScale);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    }

    function clampImage() {
        const canvasRect = canvas.getBoundingClientRect();
        const fx = (canvasRect.width - frameSize) / 2;
        const fy = (canvasRect.height - frameSize) / 2;

        const scaledW = img.width * imgScale;
        const scaledH = img.height * imgScale;

        const minX = fx + frameSize - scaledW;
        const maxX = fx;
        const minY = fy + frameSize - scaledH;
        const maxY = fy;

        if (scaledW < frameSize) imgX = fx + (frameSize - scaledW) / 2;
        else imgX = Math.min(maxX, Math.max(minX, imgX));

        if (scaledH < frameSize) imgY = fy + (frameSize - scaledH) / 2;
        else imgY = Math.min(maxY, Math.max(minY, imgY));
    }

    zoom.min = 100;
    zoom.max = 300;
    zoom.value = 100;
    zoom.title = zoom.value + '%';
    zoom.oninput = function (e) {
        const prev = imgScale;
        imgScale = baseScale * (e.target.value / 100);
        const fx = canvas.width / (2 * dpr);
        const fy = canvas.height / (2 * dpr);
        imgX = fx - ((fx - imgX) * imgScale) / prev;
        imgY = fy - ((fy - imgY) * imgScale) / prev;
        imgX = Math.round(imgX * 1000) / 1000;
        imgY = Math.round(imgY * 1000) / 1000;
        clampImage();
        draw();
        zoom.title = zoom.value + '%';
    };

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.style.touchAction = 'none';
    canvas.onpointerdown = (ev) => {
        dragging = true;
        lastX = ev.clientX;
        lastY = ev.clientY;
        canvas.setPointerCapture(ev.pointerId);
    };
    canvas.onpointermove = (ev) => {
        if (!dragging) return;
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        imgX += dx;
        imgY += dy;
        clampImage();
        draw();
    };
    wrap.addEventListener('wheel', function (ev) {
        ev.preventDefault();
        const step = ev.deltaY > 0 ? -4 : 4;
        const newV = Math.max(100, Math.min(300, Number(zoom.value) + step));
        zoom.value = newV;
        zoom.dispatchEvent(new Event('input'));
    }, { passive: false });

    let last = { x: 0, y: 0 };

    canvas.addEventListener('pointerdown', function (ev) {
        dragging = true;
        canvas.setPointerCapture(ev.pointerId);
        last.x = ev.clientX;
        last.y = ev.clientY;
    });

    window.addEventListener('pointermove', function (ev) {
        if (!dragging) return;
        const dx = ev.clientX - last.x;
        const dy = ev.clientY - last.y;
        last.x = ev.clientX;
        last.y = ev.clientY;
        imgX += dx;
        imgY += dy;
        clampImage();
        draw();
    });

    window.addEventListener('pointerup', function (ev) {
        if (!dragging) return;
        dragging = false;
    });

    clampImage();
    draw();

    confirmBtn.onclick = function () {
        const cropRect = frame.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const sx = Math.max(0, (cropRect.left - canvasRect.left) / (canvasRect.width) * canvas.width / dpr);
        const sy = Math.max(0, (cropRect.top - canvasRect.top) / (canvasRect.height) * canvas.height / dpr);
        const sw = Math.max(1, (cropRect.width / canvasRect.width) * canvas.width / dpr);
        const sh = Math.max(1, (cropRect.height / canvasRect.height) * canvas.height / dpr);
        const out = document.createElement('canvas');
        out.width = sw;
        out.height = sh;
        const outCtx = out.getContext('2d');
        outCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        state.imageData = out.toDataURL('image/jpeg', 0.9);
        modal.classList.remove('active');
        const uploadZone = document.getElementById('imageUpload');
        uploadZone.innerHTML = `<img src="${state.imageData}" style="width:100%;height:100%;object-fit:cover;border-radius:0.5rem;">`;
        updatePreview();
    };

    modal.classList.add('active');

    confirmBtn.onclick = () => {
        const canvasRect = canvas.getBoundingClientRect();
        const fx = (canvasRect.width - frameSize) / 2;
        const fy = (canvasRect.height - frameSize) / 2;

        const sx = Math.max(0, (fx - imgX) / imgScale);
        const sy = Math.max(0, (fy - imgY) / imgScale);
        const sw = frameSize / imgScale;
        const sh = frameSize / imgScale;

        const outSize = Math.max(512, Math.round(Math.min(2048, sw)));
        const out = document.createElement('canvas');
        out.width = outSize;
        out.height = outSize;
        out.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, outSize, outSize);

        state.imageData = out.toDataURL('image/jpeg', 0.9);

        const uploadZone = document.getElementById('imageUpload');
        if (uploadZone) {
            uploadZone.innerHTML = `<img src="${state.imageData}" style="width:100%;height:100%;object-fit:cover;border-radius:0.5rem;">`;
        }
        updatePreview();

        modal.classList.remove('active');
    };

    modal.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => modal.classList.remove('active')));
}


function initAudioUpload() {
    document.getElementById('audioInput').addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                state.audioData = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function initModals() {
    document.getElementById('previewExpand').addEventListener('click', () => {
        showPreviewModal();
    });

    document.getElementById('mobilePreviewBtn').addEventListener('click', () => {
        showPreviewModal();
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function showPreviewModal() {
    const modal = document.getElementById('previewModal');
    const content = modal.querySelector('.modal-content');
    
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '90vh';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '1rem';
    iframe.style.display = 'block';
    
    content.innerHTML = '';
    content.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(generateGiftHTML());
    iframeDoc.close();
    
    modal.classList.add('active');
}

function updatePreview() {
    const container = document.getElementById('previewContainer');
    if (!state.imageData || !state.letterText) {
        container.innerHTML = '<div class="preview-placeholder"><p>Add an image and letter to see preview</p></div>';
        return;
    }
    
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    
    container.innerHTML = '';
    container.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(generateGiftHTML());
    iframeDoc.close();
}

function generatePreviewHTML() {
    if (!state.imageData || !state.letterText) {
        return '<div class="preview-placeholder"><p>Add an image and letter to see preview</p></div>';
    }

    const preset = presets[state.preset];
    return `
        <div style="width:100%;height:100%;background:${preset.bgGradient};display:flex;align-items:center;justify-content:center;position:relative;">
            <div style="text-align:center;color:white;">
                <div style="font-size:2rem;margin-bottom:0.5rem;">${state.recipientName || 'Someone Special'}</div>
                <div style="font-size:1rem;opacity:0.8;">From ${state.gifterName || 'Anonymous'}</div>
                <div style="margin-top:2rem;width:120px;height:120px;background:${preset.boxColor};border-radius:8px;margin:2rem auto;position:relative;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                    <div style="position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:80%;height:8px;background:${preset.ribbonColor};"></div>
                    <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:8px;height:100%;background:${preset.ribbonColor};"></div>
                </div>
                <div style="font-size:0.875rem;opacity:0.7;">Click to open</div>
            </div>
        </div>
    `;
}

async function initGenerate() {
    document.getElementById('generateBtn').addEventListener('click', async () => {
        if (!state.imageData || !state.letterText) {
            alert('Please add an image and write a letter');
            return;
        }

        const btn = document.getElementById('generateBtn');
        btn.textContent = 'Generating...';
        btn.disabled = true;

        try {
            await generateKeepsake();
        } catch (err) {
            alert('Generation failed. Please try again.');
            console.error(err);
        } finally {
            btn.textContent = 'Generate Keepsake';
            btn.disabled = false;
        }
    });
}

function generateGiftHTML() {
    const preset = presets[state.preset];
    const fontFamily = state.customFont || preset.font;
    
    let fontLink = '';
    if (fontFamily) {
        fontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@400;600&display=swap" rel="stylesheet">`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Keepsake</title>
    ${fontLink}
    <style>${generateGiftCSS()}</style>
</head>
<body>
${generateGiftBody()}
<script>${generateGiftJS()}</script>
</body>
</html>`;
}

function generateGiftBody() {
    return `<div id="app">
    <div id="landing" class="scene active">
        <div class="landing-content">
            <h1 class="recipient-name">${state.recipientName || 'Someone Special'}</h1>
            <p class="gifter-name">From ${state.gifterName || 'Anonymous'}</p>
            <div class="gift-box" id="giftBox">
                <div class="box-body"></div>
                <div class="box-lid"></div>
                <div class="ribbon-h"></div>
                <div class="ribbon-v"></div>
                <div class="bow"></div>
            </div>
            <p class="tap-hint">Tap to open</p>
        </div>
    </div>

    <div id="letter" class="scene">
        <div class="letter-container">
            <div class="letter-paper">
                <div class="letter-content">
                    <p class="letter-text">${state.letterText.replace(/\n/g, '<br>')}</p>
                    ${state.occasionDate ? `<p class="letter-date">${new Date(state.occasionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
                </div>
            </div>
        </div>
        <p class="continue-hint">Tap anywhere to continue</p>
    </div>

    <div id="snowglobe" class="scene">
        <div class="snowglobe-container">
            <div class="globe" id="globe">
                <canvas id="particles"></canvas>
                <div class="globe-image-wrapper">
                    <img src="${state.imageData}" alt="Memory" class="globe-image">
                </div>
                <div class="glass-overlay"></div>
            </div>
            <div class="globe-stand">
                <div class="stand-top"></div>
                <div class="stand-base"></div>
                <div class="stand-plaque">
                    <p class="plaque-text">${state.occasionDate ? new Date(state.occasionDate).getFullYear() : ''}</p>
                </div>
            </div>
        </div>
        ${state.audioData ? `<audio id="audio" src="${state.audioData}"></audio>` : ''}
    </div>
</div>`;
}

function generateGiftCSS() {
    const preset = presets[state.preset];
    const fontFamily = state.customFont || preset.font;
    
    let backgroundPattern = '';
    switch(state.preset) {
        case 'birthday':
            backgroundPattern = `
                radial-gradient(circle at 15% 25%, rgba(255,107,157,0.15) 0%, transparent 40%),
                radial-gradient(circle at 85% 75%, rgba(138,43,226,0.12) 0%, transparent 35%),
                radial-gradient(circle at 45% 60%, rgba(255,215,0,0.08) 0%, transparent 30%),
                radial-gradient(circle at 70% 30%, rgba(255,255,255,0.05) 0%, transparent 25%)`;
            break;
        case 'anniversary':
            backgroundPattern = `
                radial-gradient(ellipse at 20% 80%, rgba(212,20,90,0.2) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 20%, rgba(245,87,108,0.15) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)`;
            break;
        case 'love':
            backgroundPattern = `
                radial-gradient(circle at 30% 40%, rgba(255,77,109,0.18) 0%, transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(254,225,64,0.12) 0%, transparent 35%),
                radial-gradient(ellipse at 50% 100%, rgba(255,182,193,0.1) 0%, transparent 50%)`;
            break;
        case 'sorry':
            backgroundPattern = `
                radial-gradient(circle at 25% 30%, rgba(168,237,234,0.15) 0%, transparent 45%),
                radial-gradient(circle at 75% 70%, rgba(254,214,227,0.12) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 55%)`;
            break;
        case 'festive':
            backgroundPattern = `
                radial-gradient(circle at 20% 20%, rgba(196,30,58,0.2) 0%, transparent 35%),
                radial-gradient(circle at 80% 80%, rgba(45,80,22,0.15) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 45%)`;
            break;
        default:
            backgroundPattern = `
                radial-gradient(circle at 20% 80%, rgba(224,195,252,0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(142,197,252,0.12) 0%, transparent 45%)`;
    }
    
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    background: ${preset.bgGradient};
    position: relative;
}

body::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${backgroundPattern};
    pointer-events: none;
    animation: breathe 10s ease-in-out infinite;
}

body::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.03) 100%);
    pointer-events: none;
}

@keyframes breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

#app {
    width: 100%;
    height: 100%;
    position: relative;
}

.scene {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.8s ease;
}

.scene.active {
    opacity: 1;
    pointer-events: all;
}

#landing {
    background: ${preset.bgGradient};
}

.landing-content {
    text-align: center;
    color: white;
    padding: 2rem;
    animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.recipient-name {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-shadow: 
        0 2px 15px rgba(0,0,0,0.4),
        0 0 50px rgba(255,255,255,0.15),
        0 4px 6px rgba(0,0,0,0.2);
    letter-spacing: 0.02em;
}

.gifter-name {
    font-size: clamp(1rem, 4vw, 1.5rem);
    opacity: 0.92;
    margin-bottom: 3rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.gift-box {
    width: clamp(160px, 32vw, 240px);
    height: clamp(160px, 32vw, 240px);
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
}

.gift-box:hover {
    transform: scale(1.1) rotate(-4deg) translateY(-8px);
}

.box-body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 68%;
    background: linear-gradient(135deg, 
        ${preset.boxColor} 0%,
        ${preset.boxColor} 50%,
        color-mix(in srgb, ${preset.boxColor} 85%, black) 100%);
    border-radius: 14px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.5),
        inset 0 -8px 25px rgba(0,0,0,0.25),
        inset 0 2px 8px rgba(255,255,255,0.15);
}

.box-body::before {
    content: '';
    position: absolute;
    inset: 14px;
    background: linear-gradient(135deg, 
        rgba(255,255,255,0.2) 0%, 
        rgba(255,255,255,0.08) 45%,
        transparent 65%);
    border-radius: 10px;
}

.box-body::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 5%;
    right: 5%;
    height: 20px;
    background: radial-gradient(ellipse at center, 
        rgba(0,0,0,0.4) 0%,
        rgba(0,0,0,0.2) 40%,
        transparent 70%);
    filter: blur(8px);
}

.box-lid {
    position: absolute;
    top: 19%;
    left: -6%;
    right: -6%;
    height: 20%;
    background: linear-gradient(to bottom, 
        color-mix(in srgb, ${preset.boxColor} 115%, white) 0%,
        ${preset.boxColor} 60%,
        color-mix(in srgb, ${preset.boxColor} 90%, black) 100%);
    border-radius: 14px 14px 0 0;
    box-shadow: 
        0 10px 30px rgba(0,0,0,0.4),
        inset 0 4px 12px rgba(255,255,255,0.25),
        inset 0 -3px 8px rgba(0,0,0,0.2);
}

.ribbon-h {
    position: absolute;
    top: 33%;
    left: 6%;
    right: 6%;
    height: 11%;
    background: linear-gradient(to bottom,
        color-mix(in srgb, ${preset.ribbonColor} 110%, white) 0%,
        ${preset.ribbonColor} 45%,
        color-mix(in srgb, ${preset.ribbonColor} 85%, black) 100%);
    box-shadow: 
        0 4px 12px rgba(0,0,0,0.4),
        inset 0 2px 4px rgba(255,255,255,0.4),
        inset 0 -2px 4px rgba(0,0,0,0.3);
    border-radius: 2px;
}

.ribbon-v {
    position: absolute;
    top: 19%;
    left: 50%;
    transform: translateX(-50%);
    width: 11%;
    height: 81%;
    background: linear-gradient(to right,
        rgba(0,0,0,0.15) 0%,
        color-mix(in srgb, ${preset.ribbonColor} 110%, white) 15%,
        ${preset.ribbonColor} 50%,
        color-mix(in srgb, ${preset.ribbonColor} 85%, black) 85%,
        rgba(0,0,0,0.15) 100%);
    box-shadow: 
        4px 0 12px rgba(0,0,0,0.4),
        inset 2px 0 4px rgba(255,255,255,0.4),
        inset -2px 0 4px rgba(0,0,0,0.3);
    border-radius: 2px;
}

.bow {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 32%;
    height: 20%;
    background: radial-gradient(ellipse at 40% 40%,
        color-mix(in srgb, ${preset.ribbonColor} 120%, white) 0%,
        ${preset.ribbonColor} 45%,
        color-mix(in srgb, ${preset.ribbonColor} 80%, black) 100%);
    border-radius: 50%;
    box-shadow: 
        0 6px 18px rgba(0,0,0,0.5),
        inset 0 3px 8px rgba(255,255,255,0.4),
        inset 0 -2px 6px rgba(0,0,0,0.3);
}

.bow::before,
.bow::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 68%;
    height: 105%;
    background: radial-gradient(ellipse at center,
        color-mix(in srgb, ${preset.ribbonColor} 115%, white) 0%,
        ${preset.ribbonColor} 40%,
        color-mix(in srgb, ${preset.ribbonColor} 85%, black) 100%);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 
        0 4px 14px rgba(0,0,0,0.4),
        inset 0 2px 6px rgba(255,255,255,0.35);
}

.bow::before {
    left: -58%;
}

.bow::after {
    right: -58%;
}

.gift-box.opening .box-lid {
    animation: lidOpen 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes lidOpen {
    0% {
        transform: translateY(0) rotateX(0) scale(1);
        opacity: 1;
    }
    60% {
        transform: translateY(-60px) rotateX(-30deg) scale(1.02);
        opacity: 0.6;
    }
    100% {
        transform: translateY(-140px) rotateX(-65deg) scale(0.95);
        opacity: 0;
    }
}

.gift-box.opening .bow,
.gift-box.opening .ribbon-h,
.gift-box.opening .ribbon-v {
    animation: fadeAway 0.6s ease forwards;
}

@keyframes fadeAway {
    to {
        opacity: 0;
        transform: scale(0.6) translateY(-25px);
    }
}

.tap-hint {
    margin-top: 2.8rem;
    font-size: 1.1rem;
    opacity: 0.8;
    font-weight: 300;
    letter-spacing: 0.12em;
    animation: pulse 3s ease infinite;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

@keyframes pulse {
    0%, 100% { 
        opacity: 0.65;
        transform: scale(1);
    }
    50% { 
        opacity: 1;
        transform: scale(1.04);
    }
}

#letter {
    background: 
        linear-gradient(to bottom, 
            rgba(0,0,0,0.45), 
            rgba(0,0,0,0.65)),
        ${preset.bgGradient};
    backdrop-filter: blur(25px);
    padding: 2rem;
}

.letter-container {
    max-width: 650px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    animation: letterUnfold 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes letterUnfold {
    from {
        opacity: 0;
        transform: scale(0.88) rotateX(-18deg);
    }
    to {
        opacity: 1;
        transform: scale(1) rotateX(0);
    }
}

.letter-paper {
    background: ${preset.letterBg};
    padding: clamp(2.5rem, 8vw, 4.5rem);
    border-radius: 12px;
    box-shadow: 
        0 30px 80px rgba(0,0,0,0.6),
        inset 0 0 70px rgba(0,0,0,0.04);
    position: relative;
    border: 1px solid rgba(0,0,0,0.08);
}

.letter-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(0,0,0,0.028) 31px,
            rgba(0,0,0,0.028) 32px
        );
    pointer-events: none;
    border-radius: 12px;
}

.letter-paper::after {
    content: '';
    position: absolute;
    top: 2rem;
    left: 2rem;
    right: 2rem;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        rgba(0,0,0,0.12) 20%,
        rgba(0,0,0,0.12) 80%,
        transparent 100%);
}

.letter-content {
    position: relative;
    z-index: 1;
}

.letter-text {
    font-size: clamp(1.05rem, 3vw, 1.3rem);
    line-height: 2;
    color: #2a2a2a;
    word-wrap: break-word;
    margin-bottom: 2.5rem;
    text-align: justify;
    hyphens: auto;
}

.letter-text::first-letter {
    font-size: 2.5em;
    font-weight: 600;
    float: left;
    line-height: 0.8;
    margin: 0.1em 0.1em 0 0;
    color: ${preset.accentColor};
}

.letter-date {
    font-size: 1.05rem;
    color: #666;
    font-style: italic;
    text-align: right;
    font-weight: 300;
    letter-spacing: 0.05em;
}

.continue-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.92);
    font-size: 0.95rem;
    opacity: 0.88;
    font-weight: 300;
    letter-spacing: 0.12em;
    animation: pulse 3s ease infinite;
    text-shadow: 0 3px 10px rgba(0,0,0,0.4);
}

#snowglobe {
    background: ${preset.bgGradient};
}

.snowglobe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    cursor: pointer;
}

.snowglobe-container:hover .globe {
    transform: scale(1.04) translateY(-5px);
}

.snowglobe-container:hover .globe-stand {
    transform: scale(1.04) translateY(-5px);
}

.snowglobe-container.shaking .globe {
    animation: shake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.snowglobe-container.shaking .globe-stand {
    animation: shake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.globe {
    width: clamp(320px, 68vw, 480px);
    height: clamp(320px, 68vw, 480px);
    border-radius: 50%;
    position: relative;
    overflow: visible;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1;
}

.globe:active {
    transform: scale(0.96);
}

@keyframes shake {
    0%, 100% { transform: rotate(0deg) scale(1); }
    10%, 30%, 50%, 70%, 90% { transform: rotate(-7deg) scale(0.97); }
    20%, 40%, 60%, 80% { transform: rotate(7deg) scale(1.03); }
}

.globe::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(circle at 50% 50%,
            rgba(255,255,255,0.03) 0%,
            transparent 70%);
    border-radius: 50%;
    z-index: 0;
}

.globe::after {
    content: '';
    position: absolute;
    bottom: -12%;
    left: 10%;
    right: 10%;
    height: 25%;
    background: 
        radial-gradient(ellipse at center,
            rgba(100,120,140,0.4) 0%,
            rgba(80,100,120,0.3) 30%,
            rgba(60,80,100,0.15) 60%,
            transparent 100%);
    border-radius: 50%;
    filter: blur(20px);
    z-index: 1;
}

#particles {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 50%;
    pointer-events: none;
}

.globe-image-wrapper {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 
        inset 0 0 0 3px rgba(255,255,255,0.15),
        inset 0 0 80px rgba(0,0,0,0.2);
}

.globe-image {
    width: 120%;
    height: 120%;
    object-fit: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: brightness(0.85) contrast(1.15) saturate(1.1);
}

.glass-overlay {
    position: absolute;
    inset: 0;
    z-index: 4;
    border-radius: 50%;
    background: 
        radial-gradient(circle at 28% 25%, 
            rgba(255,255,255,0.75) 0%, 
            rgba(255,255,255,0.4) 12%,
            transparent 35%),
        radial-gradient(circle at 72% 75%, 
            rgba(255,255,255,0.2) 0%, 
            transparent 30%),
        radial-gradient(circle at 50% 50%,
            transparent 35%,
            ${state.glassTint}12 65%,
            ${state.glassTint}28 90%,
            ${state.glassTint}40 100%);
    box-shadow: 
        0 35px 100px rgba(0,0,0,0.6),
        0 18px 50px rgba(0,0,0,0.4),
        inset 0 0 0 3px rgba(255,255,255,0.3),
        inset 0 8px 40px rgba(255,255,255,0.25),
        inset 0 -8px 40px rgba(0,0,0,0.2),
        inset -25px -25px 80px rgba(0,0,0,0.12);
    pointer-events: none;
}

.glass-overlay::before {
    content: '';
    position: absolute;
    inset: 4%;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: rgba(255,255,255,0.6);
    border-left-color: rgba(255,255,255,0.4);
    border-right-color: rgba(255,255,255,0.15);
}

.glass-overlay::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 15%;
    width: 40%;
    height: 40%;
    background: 
        radial-gradient(ellipse at 30% 30%,
            rgba(255,255,255,0.9) 0%,
            rgba(255,255,255,0.6) 20%,
            rgba(255,255,255,0.2) 45%,
            transparent 70%);
    filter: blur(20px);
    transform: rotate(-35deg);
}

.globe-stand {
    width: clamp(240px, 55vw, 380px);
    margin-top: -8%;
    z-index: 2;
    filter: drop-shadow(0 25px 60px rgba(0,0,0,0.6));
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
}

.stand-top {
    height: clamp(32px, 4vw, 42px);
    background: 
        linear-gradient(to bottom, 
            #c9a870 0%, 
            #b89968 20%,
            #a08460 45%,
            #8b6f47 70%,
            #6d5736 100%);
    border-radius: 50% 50% 0 0 / 30% 30% 0 0;
    box-shadow: 
        0 12px 30px rgba(0,0,0,0.6),
        inset 0 5px 15px rgba(255,255,255,0.25),
        inset 0 -4px 12px rgba(0,0,0,0.35);
    position: relative;
}

.stand-top::before {
    content: '';
    position: absolute;
    inset: 10% 12% auto 12%;
    height: 20%;
    background: 
        linear-gradient(to right,
            transparent 0%,
            rgba(255,255,255,0.4) 20%,
            rgba(255,255,255,0.4) 80%,
            transparent 100%);
    border-radius: 50%;
}

.stand-top::after {
    content: '';
    position: absolute;
    inset: 15% 14% auto 14%;
    height: 4px;
    background: 
        linear-gradient(to right,
            transparent 0%,
            rgba(0,0,0,0.25) 30%,
            rgba(0,0,0,0.25) 70%,
            transparent 100%);
}

.stand-base {
    height: clamp(55px, 7vw, 72px);
    background: 
        linear-gradient(to bottom, 
            #6d5736 0%,
            #5a4529 30%,
            #4a3820 60%,
            #3a2f1a 100%);
    border-radius: 12px;
    box-shadow: 
        0 20px 60px rgba(0,0,0,0.7),
        inset 0 -5px 15px rgba(0,0,0,0.5),
        inset 0 3px 8px rgba(255,255,255,0.12);
    position: relative;
}

.stand-base::before {
    content: '';
    position: absolute;
    top: 22%;
    left: 15%;
    right: 15%;
    height: 10%;
    background: 
        linear-gradient(to right,
            transparent 0%,
            rgba(0,0,0,0.5) 25%,
            rgba(0,0,0,0.5) 75%,
            transparent 100%);
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(255,255,255,0.1);
}

.stand-base::after {
    content: '';
    position: absolute;
    inset: 6% 10%;
    background: 
        linear-gradient(135deg,
            rgba(255,255,255,0.08) 0%,
            transparent 45%);
    border-radius: 8px;
}

.stand-plaque {
    position: absolute;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);
    background: 
        linear-gradient(to bottom,
            #e8ca68 0%,
            #d4af37 30%,
            #c9a030 60%,
            #b8941f 100%);
    padding: clamp(0.35rem, 1vw, 0.5rem) clamp(1.2rem, 3vw, 1.8rem);
    border-radius: 5px;
    box-shadow: 
        0 4px 12px rgba(0,0,0,0.6),
        inset 0 2px 4px rgba(255,255,255,0.5),
        inset 0 -2px 4px rgba(0,0,0,0.35);
    border: 1px solid rgba(0,0,0,0.25);
}

.plaque-text {
    font-size: clamp(0.7rem, 1.5vw, 0.85rem);
    font-weight: 700;
    color: #3a2f1a;
    letter-spacing: 0.12em;
    text-shadow: 
        0 1px 2px rgba(255,255,255,0.5),
        0 -1px 1px rgba(0,0,0,0.25);
}

@media (max-width: 768px) {
    .letter-container {
        max-width: 100%;
    }
    
    .letter-paper {
        border-radius: 0;
    }
    
    .letter-text::first-letter {
        font-size: 2em;
    }
}
}
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${fontFamily}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    background: ${preset.bgGradient};
    position: relative;
}

body::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%);
    pointer-events: none;
    animation: breathe 8s ease-in-out infinite;
}

@keyframes breathe {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

#app {
    width: 100%;
    height: 100%;
    position: relative;
}

.scene {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.8s ease;
}

.scene.active {
    opacity: 1;
    pointer-events: all;
}

#landing {
    background: ${preset.bgGradient};
}

.landing-content {
    text-align: center;
    color: white;
    padding: 2rem;
    animation: fadeInUp 1s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.recipient-name {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-shadow: 
        0 2px 10px rgba(0,0,0,0.3),
        0 0 40px rgba(255,255,255,0.1);
    letter-spacing: 0.02em;
}

.gifter-name {
    font-size: clamp(1rem, 4vw, 1.5rem);
    opacity: 0.9;
    margin-bottom: 3rem;
    font-weight: 300;
    letter-spacing: 0.05em;
}

.gift-box {
    width: clamp(150px, 30vw, 220px);
    height: clamp(150px, 30vw, 220px);
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 15px 35px rgba(0,0,0,0.4));
}

.gift-box:hover {
    transform: scale(1.08) rotate(-3deg);
}

.box-body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    background: ${preset.boxColor};
    border-radius: 12px;
    box-shadow: 
        0 15px 50px rgba(0,0,0,0.4),
        inset 0 -5px 20px rgba(0,0,0,0.2);
}

.box-body::before {
    content: '';
    position: absolute;
    inset: 12px;
    background: linear-gradient(135deg, 
        rgba(255,255,255,0.15) 0%, 
        rgba(255,255,255,0.05) 40%,
        transparent 60%);
    border-radius: 8px;
}

.box-body::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 10%;
    right: 10%;
    height: 5px;
    background: rgba(0,0,0,0.15);
    border-radius: 50%;
    filter: blur(5px);
}

.box-lid {
    position: absolute;
    top: 20%;
    left: -5%;
    right: -5%;
    height: 18%;
    background: linear-gradient(to bottom, 
        ${preset.boxColor} 0%,
        ${preset.boxColor} 70%,
        rgba(0,0,0,0.1) 100%);
    filter: brightness(1.15);
    border-radius: 12px 12px 0 0;
    box-shadow: 
        0 8px 25px rgba(0,0,0,0.3),
        inset 0 3px 10px rgba(255,255,255,0.2);
}

.ribbon-h {
    position: absolute;
    top: 32%;
    left: 8%;
    right: 8%;
    height: 10%;
    background: linear-gradient(to bottom,
        ${preset.ribbonColor} 0%,
        ${preset.ribbonColor} 50%,
        rgba(0,0,0,0.1) 100%);
    box-shadow: 
        0 3px 10px rgba(0,0,0,0.3),
        inset 0 1px 2px rgba(255,255,255,0.3);
}

.ribbon-v {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 10%;
    height: 80%;
    background: linear-gradient(to right,
        rgba(0,0,0,0.1) 0%,
        ${preset.ribbonColor} 20%,
        ${preset.ribbonColor} 80%,
        rgba(0,0,0,0.1) 100%);
    box-shadow: 
        3px 0 10px rgba(0,0,0,0.3),
        inset 1px 0 2px rgba(255,255,255,0.3);
}

.bow {
    position: absolute;
    top: 12%;
    left: 50%;
    transform: translateX(-50%);
    width: 30%;
    height: 18%;
    background: radial-gradient(ellipse at center,
        ${preset.ribbonColor} 0%,
        ${preset.ribbonColor} 60%,
        rgba(0,0,0,0.1) 100%);
    border-radius: 50%;
    box-shadow: 
        0 5px 15px rgba(0,0,0,0.4),
        inset 0 2px 5px rgba(255,255,255,0.3);
}

.bow::before,
.bow::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 65%;
    height: 100%;
    background: radial-gradient(ellipse at center,
        ${preset.ribbonColor} 0%,
        ${preset.ribbonColor} 50%,
        rgba(0,0,0,0.1) 100%);
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
}

.bow::before {
    left: -55%;
}

.bow::after {
    right: -55%;
}

.gift-box.opening .box-lid {
    animation: lidOpen 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes lidOpen {
    0% {
        transform: translateY(0) rotateX(0);
        opacity: 1;
    }
    50% {
        transform: translateY(-50px) rotateX(-25deg);
        opacity: 0.7;
    }
    100% {
        transform: translateY(-120px) rotateX(-60deg);
        opacity: 0;
    }
}

.gift-box.opening .bow,
.gift-box.opening .ribbon-h,
.gift-box.opening .ribbon-v {
    animation: fadeAway 0.5s ease forwards;
}

@keyframes fadeAway {
    to {
        opacity: 0;
        transform: scale(0.7) translateY(-20px);
    }
}

.tap-hint {
    margin-top: 2.5rem;
    font-size: 1.1rem;
    opacity: 0.75;
    font-weight: 300;
    letter-spacing: 0.1em;
    animation: pulse 2.5s ease infinite;
}

@keyframes pulse {
    0%, 100% { 
        opacity: 0.6;
        transform: scale(1);
    }
    50% { 
        opacity: 1;
        transform: scale(1.03);
    }
}

#letter {
    background: 
        linear-gradient(to bottom, 
            rgba(0,0,0,0.4), 
            rgba(0,0,0,0.6)),
        ${preset.bgGradient};
    backdrop-filter: blur(20px);
    padding: 2rem;
}

.letter-container {
    max-width: 650px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    animation: letterUnfold 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes letterUnfold {
    from {
        opacity: 0;
        transform: scale(0.9) rotateX(-15deg);
    }
    to {
        opacity: 1;
        transform: scale(1) rotateX(0);
    }
}

.letter-paper {
    background: ${preset.letterBg};
    padding: clamp(2.5rem, 8vw, 4.5rem);
    border-radius: 12px;
    box-shadow: 
        0 25px 70px rgba(0,0,0,0.5),
        inset 0 0 60px rgba(0,0,0,0.03);
    position: relative;
    border: 1px solid rgba(0,0,0,0.05);
}

.letter-paper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
        repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(0,0,0,0.025) 31px,
            rgba(0,0,0,0.025) 32px
        );
    pointer-events: none;
    border-radius: 12px;
}

.letter-paper::after {
    content: '';
    position: absolute;
    top: 2rem;
    left: 2rem;
    right: 2rem;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        rgba(0,0,0,0.1) 20%,
        rgba(0,0,0,0.1) 80%,
        transparent 100%);
}

.letter-content {
    position: relative;
    z-index: 1;
}

.letter-text {
    font-size: clamp(1.05rem, 3vw, 1.3rem);
    line-height: 2;
    color: #2a2a2a;
    word-wrap: break-word;
    margin-bottom: 2.5rem;
    text-align: justify;
    hyphens: auto;
}

.letter-text::first-letter {
    font-size: 2.5em;
    font-weight: 600;
    float: left;
    line-height: 0.8;
    margin: 0.1em 0.1em 0 0;
    color: ${preset.accentColor};
}

.letter-date {
    font-size: 1.05rem;
    color: #666;
    font-style: italic;
    text-align: right;
    font-weight: 300;
    letter-spacing: 0.05em;
}

.continue-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.9);
    font-size: 0.95rem;
    opacity: 0.85;
    font-weight: 300;
    letter-spacing: 0.1em;
    animation: pulse 2.5s ease infinite;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

#snowglobe {
    background: ${preset.bgGradient};
}

.snowglobe-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    animation: fadeInUp 1s ease;
}

.globe {
    width: clamp(300px, 65vw, 450px);
    height: clamp(300px, 65vw, 450px);
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 
        0 25px 70px rgba(0,0,0,0.4),
        0 10px 30px rgba(0,0,0,0.2),
        inset 0 0 80px rgba(255,255,255,0.08);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: radial-gradient(circle at 30% 30%,
        rgba(255,255,255,0.05) 0%,
        transparent 70%);
}

.globe:hover {
    transform: scale(1.03);
}

.globe:active {
    transform: scale(0.97);
}

.globe.shaking {
    animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

@keyframes shake {
    0%, 100% { transform: rotate(0deg) scale(1); }
    10%, 30%, 50%, 70%, 90% { transform: rotate(-6deg) scale(0.98); }
    20%, 40%, 60%, 80% { transform: rotate(6deg) scale(1.02); }
}

#particles {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: 50%;
}

.globe-image-wrapper {
    position: absolute;
    inset: 12%;
    z-index: 1;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset 0 0 30px rgba(0,0,0,0.2);
}

.globe-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.92) contrast(1.08) saturate(1.1);
}

.glass-overlay {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 50%;
    background: 
        radial-gradient(circle at 35% 35%, 
            ${state.glassTint}99 0%, 
            ${state.glassTint}33 30%,
            transparent 55%),
        radial-gradient(circle at 75% 75%, 
            ${state.glassTint}26 0%, 
            transparent 45%),
        radial-gradient(circle at 50% 50%,
            transparent 40%,
            ${state.glassTint}0d 80%,
            ${state.glassTint}1a 100%);
    box-shadow: 
        inset 0 0 100px ${state.glassTint}40,
        inset -15px -15px 50px rgba(0,0,0,0.15),
        inset 15px 15px 50px rgba(255,255,255,0.1);
    pointer-events: none;
}

.glass-overlay::before {
    content: '';
    position: absolute;
    inset: 6%;
    border-radius: 50%;
    border: 3px solid ${state.glassTint}66;
    border-bottom-color: transparent;
    border-right-color: ${state.glassTint}26;
    box-shadow: 0 0 20px ${state.glassTint}40;
}

.glass-overlay::after {
    content: '';
    position: absolute;
    top: 12%;
    left: 18%;
    width: 35%;
    height: 35%;
    background: radial-gradient(ellipse at 30% 30%,
        ${state.glassTint}cc 0%,
        ${state.glassTint}66 30%,
        transparent 75%);
    filter: blur(15px);
    transform: rotate(-40deg);
}

.globe-stand {
    width: clamp(220px, 50vw, 340px);
    margin-top: -25px;
    z-index: 0;
    filter: drop-shadow(0 15px 35px rgba(0,0,0,0.4));
}

.stand-top {
    height: 35px;
    background: linear-gradient(to bottom, 
        #a08460 0%, 
        #8b6f47 50%,
        #6d5736 100%);
    border-radius: 50% 50% 0 0 / 25% 25% 0 0;
    box-shadow: 
        0 8px 20px rgba(0,0,0,0.4),
        inset 0 3px 10px rgba(255,255,255,0.15);
    position: relative;
}

.stand-top::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 12%;
    right: 12%;
    height: 4px;
    background: linear-gradient(to right,
        transparent 0%,
        rgba(255,255,255,0.25) 50%,
        transparent 100%);
    border-radius: 2px;
}

.stand-base {
    height: 60px;
    background: linear-gradient(to bottom, 
        #6d5736 0%,
        #5a4529 50%,
        #4a3820 100%);
    border-radius: 10px;
    box-shadow: 
        0 15px 40px rgba(0,0,0,0.5),
        inset 0 -3px 10px rgba(0,0,0,0.3);
    position: relative;
}

.stand-base::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 18%;
    right: 18%;
    height: 3px;
    background: rgba(0,0,0,0.4);
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(255,255,255,0.1);
}

.stand-plaque {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom,
        #d4af37 0%,
        #c9a030 50%,
        #b8941f 100%);
    padding: 0.4rem 1.5rem;
    border-radius: 4px;
    box-shadow: 
        0 2px 8px rgba(0,0,0,0.4),
        inset 0 1px 2px rgba(255,255,255,0.3);
}

.plaque-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #3a2f1a;
    letter-spacing: 0.1em;
    text-shadow: 0 1px 1px rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
    .letter-container {
        max-width: 100%;
    }
    
    .letter-paper {
        border-radius: 0;
    }
    
    .letter-text::first-letter {
        font-size: 2em;
    }
}`;
}

function generateGiftJS() {
    return `<div id="landing" class="scene active">
        <div class="landing-content">
            <h1 class="recipient-name">${state.recipientName || 'Someone Special'}</h1>
            <p class="gifter-name">From ${state.gifterName || 'Anonymous'}</p>
            <div class="gift-box" id="giftBox">
                <div class="box-body"></div>
                <div class="box-lid"></div>
                <div class="ribbon-h"></div>
                <div class="ribbon-v"></div>
                <div class="bow"></div>
            </div>
            <p class="tap-hint">Tap to open</p>
        </div>
    </div>

    <div id="letter" class="scene">
        <div class="letter-container">
            <div class="letter-paper">
                <div class="letter-content">
                    <p class="letter-text">${state.letterText.replace(/\n/g, '<br>')}</p>
                    ${state.occasionDate ? `<p class="letter-date">${new Date(state.occasionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
                </div>
            </div>
        </div>
        <p class="continue-hint">Tap anywhere to continue</p>
    </div>`;
}

function generateGiftJS() {
    return `const config = {
    particleType: '${state.particleType}',
    particleDensity: ${state.particleDensity},
    particleSpeed: ${state.particleSpeed}
};

let currentScene = 'landing';
let particleSystem = null;

document.addEventListener('DOMContentLoaded', () => {
    initScenes();
    initSnowglobe();
});

function initScenes() {
    const giftBox = document.getElementById('giftBox');
    giftBox.addEventListener('click', openGift);

    const letter = document.getElementById('letter');
    letter.addEventListener('click', () => {
        if (currentScene === 'letter') {
            transitionTo('snowglobe');
        }
    });
}

function openGift() {
    const giftBox = document.getElementById('giftBox');
    giftBox.classList.add('opening');
    
    setTimeout(() => {
        transitionTo('letter');
    }, 750);
}

function transitionTo(sceneName) {
    document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
    document.getElementById(sceneName).classList.add('active');
    currentScene = sceneName;

    if (sceneName === 'snowglobe') {
        startParticles();
        tryPlayAudio();
    }
}

function initSnowglobe() {
    const container = document.querySelector('.snowglobe-container');
    container.addEventListener('click', () => {
        container.classList.add('shaking');
        if (particleSystem) {
            particleSystem.shake();
        }
        setTimeout(() => container.classList.remove('shaking'), 700);
    });
}

function tryPlayAudio() {
    const audio = document.getElementById('audio');
    if (audio && audio.src) {
        audio.play().catch(() => {});
    }
}

function startParticles() {
    if (particleSystem) return;

    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    const globe = document.getElementById('globe');

    function resize() {
        canvas.width = globe.offsetWidth;
        canvas.height = globe.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    particleSystem = new ParticleSystem(canvas, ctx, config);
    particleSystem.start();
}

class ParticleSystem {
    constructor(canvas, ctx, config) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.config = config;
        this.particles = [];
        this.settledParticles = [];
        this.animating = false;
        this.gravity = 0.18;
        this.settled = false;
        this.init();
    }

    init() {
        const activeCount = Math.floor(this.config.particleDensity * 0.3);
        for (let i = 0; i < activeCount; i++) {
            this.particles.push(this.createParticle());
        }
        
        const settledCount = Math.floor(this.config.particleDensity * 2);
        for (let i = 0; i < settledCount; i++) {
            this.settledParticles.push(this.createSettledParticle());
        }
    }

    createParticle() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height * 0.5;
        const size = Math.random() * 6 + 3;
        const speed = (Math.random() * 0.7 + 0.5) * (this.config.particleSpeed / 5);
        const wobble = Math.random() * Math.PI * 2;

        return {
            x,
            y,
            size,
            speed,
            baseSpeed: speed,
            wobble,
            wobbleSpeed: Math.random() * 0.03 + 0.015,
            opacity: Math.random() * 0.7 + 0.4,
            rotation: Math.random() * Math.PI * 2,
            settling: false,
            settled: false,
            active: true
        };
    }

    createSettledParticle() {
        const bottomHeight = this.canvas.height * 0.2;
        const x = Math.random() * this.canvas.width;
        const baseY = this.canvas.height;
        const heightFactor = Math.pow(Math.random(), 4);
        const y = baseY - (heightFactor * bottomHeight);
        const size = Math.random() * 5 + 2.5;
        
        const centerX = this.canvas.width / 2;
        const distFromCenter = Math.abs(x - centerX) / (this.canvas.width / 2);
        const densityFactor = 1 - Math.pow(distFromCenter, 1.5);

        return {
            x,
            y,
            size,
            opacity: (Math.random() * 0.4 + 0.3) * (0.5 + densityFactor * 0.5),
            rotation: Math.random() * Math.PI * 2,
            settled: true,
            active: true
        };
    }

    update() {
        const bottomZone = this.canvas.height * 0.6;
        
        this.particles = this.particles.filter(p => p.active);
        
        this.particles.forEach(p => {
            if (!p.settled) {
                p.y += p.speed + this.gravity;
                p.wobble += p.wobbleSpeed;
                p.x += Math.sin(p.wobble) * 0.7;
                p.rotation += 0.03;

                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;

                if (p.y > bottomZone && !p.settling) {
                    p.settling = true;
                    p.speed *= 0.25;
                }

                if (p.y >= this.canvas.height - p.size) {
                    p.settled = true;
                    p.speed = 0;
                    const heightFactor = Math.pow(Math.random(), 4);
                    p.y = this.canvas.height - (heightFactor * this.canvas.height * 0.2);
                    
                    this.settledParticles.push({
                        x: p.x,
                        y: p.y,
                        size: p.size,
                        opacity: p.opacity * 0.8,
                        rotation: p.rotation,
                        settled: true,
                        active: true
                    });
                    
                    p.active = false;
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.settledParticles.filter(p => p.active).forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity * 0.75;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.drawParticleShape(p);
            this.ctx.restore();
        });

        this.particles.filter(p => p.active).forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.settled ? p.opacity * 0.7 : p.opacity;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.drawParticleShape(p);
            this.ctx.restore();
        });
    }

    drawParticleShape(p) {
        switch (this.config.particleType) {
            case 'snow':
                this.drawSnow(p);
                break;
            case 'hearts':
                this.drawHeart(p);
                break;
            case 'glitter':
                this.drawGlitter(p);
                break;
            case 'confetti':
                this.drawConfetti(p);
                break;
        }
    }

    drawSnow(p) {
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.6, '#f5f5f5');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i < 6; i++) {
            this.ctx.save();
            this.ctx.rotate((Math.PI * 2 / 6) * i);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -p.size * 1.2);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    drawHeart(p) {
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.5);
        gradient.addColorStop(0, '#ff6b9d');
        gradient.addColorStop(0.7, '#ff4d7a');
        gradient.addColorStop(1, 'rgba(255,107,157,0)');
        
        this.ctx.fillStyle = gradient;
        const s = p.size;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.3);
        this.ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255,200,220,0.5)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.2);
        this.ctx.bezierCurveTo(-s * 0.6, -s * 0.2, -s * 0.3, -s * 0.6, 0, -s * 0.2);
        this.ctx.bezierCurveTo(s * 0.3, -s * 0.6, s * 0.6, -s * 0.2, 0, s * 0.2);
        this.ctx.fill();
    }

    drawGlitter(p) {
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.4);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.2, '#ffd700');
        gradient.addColorStop(0.5, '#ffed4e');
        gradient.addColorStop(1, 'rgba(255,215,0,0)');
        this.ctx.fillStyle = gradient;
        
        this.ctx.save();
        for (let i = 0; i < 4; i++) {
            this.ctx.rotate(Math.PI / 4);
            this.ctx.fillRect(-p.size * 1.4, -p.size * 0.2, p.size * 2.8, p.size * 0.4);
        }
        this.ctx.restore();
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.9)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawConfetti(p) {
        const colors = [
            ['#ff6b9d', '#ff4d7a'],
            ['#ffd700', '#ffed4e'], 
            ['#4ecdc4', '#3db8af'],
            ['#ff6b6b', '#ff5252'],
            ['#a29bfe', '#8b83f5']
        ];
        const colorPair = colors[Math.floor((p.x + p.y) * 0.1) % colors.length];
        
        const gradient = this.ctx.createLinearGradient(0, -p.size * 2, 0, p.size * 2);
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(1, colorPair[1]);
        this.ctx.fillStyle = gradient;
        
        this.ctx.shadowColor = 'rgba(0,0,0,0.4)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillRect(-p.size * 0.7, -p.size * 2, p.size * 1.4, p.size * 4);
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        this.ctx.fillRect(-p.size * 0.6, -p.size * 1.8, p.size * 0.5, p.size * 1.5);
    }

    shake() {
        const particlesToAdd = Math.floor(this.settledParticles.length * 0.5);
        const shuffled = this.settledParticles.filter(p => p.active).sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(particlesToAdd, shuffled.length); i++) {
            const p = shuffled[i];
            const newParticle = {
                x: p.x,
                y: p.y - Math.random() * this.canvas.height * 0.15,
                size: p.size,
                speed: (Math.random() * 0.5 + 0.3) * (this.config.particleSpeed / 5) * 2,
                baseSpeed: (Math.random() * 0.5 + 0.3) * (this.config.particleSpeed / 5),
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: (Math.random() * 0.03 + 0.015) * 2,
                opacity: p.opacity,
                rotation: p.rotation,
                settling: false,
                settled: false,
                active: true
            };
            this.particles.push(newParticle);
        }
        
        this.particles.forEach(p => {
            if (p.active && !p.settled) {
                p.speed = p.baseSpeed * 3;
                p.wobbleSpeed *= 2.5;
            }
        });

        setTimeout(() => {
            this.particles.forEach(p => {
                if (p.active && !p.settled) {
                    p.speed = p.baseSpeed;
                    p.wobbleSpeed /= 2.5;
                }
            });
        }, 700);
    }

    animate() {
        this.update();
        this.draw();
        if (this.animating) {
            requestAnimationFrame(() => this.animate());
        }
    }

    start() {
        this.animating = true;
        this.animate();
    }

    stop() {
        this.animating = false;
    }
}`;
}

async function generateKeepsake() {
    if (!state.imageData || !state.letterText) {
        alert('Please add an image and write a letter');
        return;
    }

    const btn = document.getElementById('generateBtn');
    btn.textContent = 'Generating...';
    btn.disabled = true;

    try {
        const html = generateGiftHTML();
        downloadKeepsake(html);
    } catch (err) {
        alert('Generation failed. Please try again.');
        console.error(err);
    } finally {
        btn.textContent = 'Generate Keepsake';
        btn.disabled = false;
    }
}

function downloadKeepsake(html) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keepsake.html';
    a.click();
    URL.revokeObjectURL(url);
}