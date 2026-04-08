import { languages } from './languages.js';

// State Management
let state = {
    selectedLanguage: languages[0],
    p: 4,
    s: '',
    xEnd: 0,
    yEnd: 1,
    i: 1
};

// DOM Elements
const elements = {
    languageSelect: document.getElementById('language-select'),
    pValue: document.getElementById('p-value'),
    sValue: document.getElementById('s-value'),
    autoGenerate: document.getElementById('auto-generate'),
    sValidation: document.getElementById('s-validation'),
    
    decompositionPanel: document.getElementById('decomposition-panel'),
    stringVisualizer: document.getElementById('string-visualizer'),
    xSlider: document.getElementById('x-slider'),
    ySlider: document.getElementById('y-slider'),
    xLen: document.getElementById('x-len'),
    yLen: document.getElementById('y-len'),
    displayX: document.getElementById('display-x'),
    displayY: document.getElementById('display-y'),
    displayZ: document.getElementById('display-z'),

    pumpingPanel: document.getElementById('pumping-panel'),
    iValue: document.getElementById('i-value'),
    iDisplay: document.getElementById('i-display'),
    resultVisualizer: document.getElementById('result-visualizer'),
    membershipResult: document.getElementById('membership-result'),
    
    explanationText: document.getElementById('explanation-text'),
    analysisSidebarText: document.getElementById('analysis-sidebar-text'),
    
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    
    toggleTheoryBtn: document.getElementById('toggle-theory-btn'),
    toggleTheoryText: document.getElementById('toggle-theory-text'),
    theoryPanel: document.getElementById('theory-panel'),

    stepIndicators: [
        document.getElementById('step-1-indicator'),
        document.getElementById('step-2-indicator'),
        document.getElementById('step-3-indicator')
    ],
    
    confirmSetupBtn: document.getElementById('confirm-setup'),
    confirmDecompositionBtn: document.getElementById('confirm-decomposition'),
    resetAppBtn: document.getElementById('reset-app'),
    
    toggleAnalysisBtn: document.getElementById('toggle-analysis-btn'),
    toggleAnalysisText: document.getElementById('toggle-analysis-text'),
    explanationPanel: document.getElementById('explanation-panel')
};

function updateStepper(activeStepIndex) {
    elements.stepIndicators.forEach((stepEl, index) => {
        if (!stepEl) return;
        if (index === activeStepIndex) {
            stepEl.classList.add('active');
            stepEl.classList.remove('inactive');
        } else {
            stepEl.classList.add('inactive');
            stepEl.classList.remove('active');
        }
    });
}

// Initialization
function init() {
    setupEventListeners();
    updateLanguage();
    autoGenerateString();
}

function setupEventListeners() {
    elements.languageSelect.addEventListener('change', (e) => {
        state.selectedLanguage = languages.find(l => l.id === e.target.value);
        updateLanguage();
        autoGenerateString();
    });

    elements.pValue.addEventListener('input', (e) => {
        state.p = parseInt(e.target.value) || 1;
        validateString();
    });

    elements.sValue.addEventListener('input', () => {
        state.s = elements.sValue.value;
        validateString();
    });

    elements.autoGenerate.addEventListener('click', autoGenerateString);

    elements.xSlider.addEventListener('input', (e) => {
        state.xEnd = parseInt(e.target.value);
        // Ensure |xy| <= p
        if (state.xEnd + (state.yEnd - state.xEnd) > state.p) {
            // This case shouldn't happen with proper slider maxes, but let's be safe
        }
        updateDecomposition();
    });

    elements.ySlider.addEventListener('input', (e) => {
        state.yEnd = parseInt(e.target.value);
        updateDecomposition();
    });

    elements.iValue.addEventListener('input', (e) => {
        state.i = parseInt(e.target.value);
        elements.iDisplay.textContent = state.i;
        updatePumpingResult();
    });

    elements.toggleTheoryBtn.addEventListener('click', () => {
        const isHidden = elements.theoryPanel.style.display === 'none' || elements.theoryPanel.style.display === '';
        if (isHidden) {
            elements.theoryPanel.style.display = 'grid'; // .theory-layout uses grid
            elements.toggleTheoryText.textContent = 'Hide Theory';
        } else {
            elements.theoryPanel.style.display = 'none';
            elements.toggleTheoryText.textContent = 'Theory Reference';
        }
    });

    elements.confirmSetupBtn.addEventListener('click', () => {
        elements.decompositionPanel.classList.remove('disabled');
        setupSliders();
        updateDecomposition();
        updateStepper(1); // Move to Step 2
    });

    elements.confirmDecompositionBtn.addEventListener('click', () => {
        elements.pumpingPanel.classList.remove('disabled');
        updatePumpingResult();
        updateStepper(2); // Move to Step 3
    });

    elements.resetAppBtn.addEventListener('click', () => {
        elements.sValue.value = '';
        state.s = '';
        validateString();
    });

    elements.themeToggleBtn.addEventListener('click', () => {
        const body = document.body;
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            // Sun icon for switching back to dark mode
            elements.themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        } else {
            // Moon icon for switching to light mode
            elements.themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        }
    });

    elements.toggleAnalysisBtn.addEventListener('click', () => {
        const isHidden = elements.explanationPanel.style.display === 'none' || elements.explanationPanel.style.display === '';
        if (isHidden) {
            elements.explanationPanel.style.display = 'block';
            elements.toggleAnalysisText.textContent = 'Hide Analysis';
        } else {
            elements.explanationPanel.style.display = 'none';
            elements.toggleAnalysisText.textContent = 'Analysis';
        }
    });

    // Initalize theory panel hidden state
    elements.theoryPanel.style.display = 'none';
    elements.explanationPanel.style.display = 'none';
}

function updateLanguage() {
    elements.explanationText.innerHTML = `<strong>Language:</strong> ${state.selectedLanguage.name}<br>${state.selectedLanguage.description}`;
    validateString();
}

function autoGenerateString() {
    state.s = state.selectedLanguage.generateExample(state.p);
    elements.sValue.value = state.s;
    validateString();
}

function validateString() {
    const s = state.s;
    const p = state.p;
    let isValid = true;
    let errorMsg = '';

    if (s.length < p) {
        isValid = false;
        errorMsg = `String length must be ≥ p (${p}). Current length: ${s.length}`;
    } else if (!state.selectedLanguage.check(s)) {
        isValid = false;
        errorMsg = `String "${s}" is not in the language L.`;
    }

    elements.sValidation.textContent = errorMsg;
    elements.sValidation.className = isValid ? 'validation-msg success' : 'validation-msg error';

    if (isValid) {
        elements.confirmSetupBtn.disabled = false;
        elements.confirmSetupBtn.classList.remove('disabled');
        // Keep next panels disabled until explicit confirm
        elements.decompositionPanel.classList.add('disabled');
        elements.pumpingPanel.classList.add('disabled');
        updateStepper(0); // Stay on Step 1 until confirmed
    } else {
        elements.confirmSetupBtn.disabled = true;
        elements.confirmSetupBtn.classList.add('disabled');
        elements.decompositionPanel.classList.add('disabled');
        elements.pumpingPanel.classList.add('disabled');
        updateStepper(0); // Only first step active
    }
}

function setupSliders() {
    const sLen = state.s.length;
    // |xy| <= p, so xEnd + length(y) <= p
    // And |y| > 0, so yEnd > xEnd
    elements.xSlider.max = Math.min(sLen - 1, state.p - 1);
    
    // Initial xEnd can be 0 (empty x)
    state.xEnd = 0;
    elements.xSlider.value = state.xEnd;

    updateYSliderRange();
}

function updateYSliderRange() {
    // y must start after x and end no later than p
    const minEnd = state.xEnd + 1;
    const maxEnd = Math.min(state.s.length, state.p);
    
    elements.ySlider.min = minEnd;
    elements.ySlider.max = maxEnd;
    
    // Adjust yEnd if it's out of bounds
    if (state.yEnd < minEnd) state.yEnd = minEnd;
    if (state.yEnd > maxEnd) state.yEnd = maxEnd;
    
    elements.ySlider.value = state.yEnd;
}

function updateDecomposition() {
    updateYSliderRange();

    const s = state.s;
    const x = s.slice(0, state.xEnd);
    const y = s.slice(state.xEnd, state.yEnd);
    const z = s.slice(state.yEnd);

    // Update displays
    elements.xLen.textContent = x.length;
    elements.yLen.textContent = y.length;
    elements.displayX.textContent = x || 'ε';
    elements.displayY.textContent = y;
    elements.displayZ.textContent = z || 'ε';

    // Update visualization
    elements.stringVisualizer.innerHTML = '';
    s.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'char';
        if (i < state.xEnd) span.classList.add('x');
        else if (i < state.yEnd) span.classList.add('y');
        else span.classList.add('z');
        elements.stringVisualizer.appendChild(span);
    });

    // update pumping result in background without enabling panel
    if (!elements.pumpingPanel.classList.contains('disabled')) {
        updatePumpingResult();
    }
}

function updatePumpingResult() {
    const s = state.s;
    const x = s.slice(0, state.xEnd);
    const y = s.slice(state.xEnd, state.yEnd);
    const z = s.slice(state.yEnd);
    const i = state.i;

    const pumpedString = x + y.repeat(i) + z;
    
    // Visual result
    elements.resultVisualizer.innerHTML = '';
    const resX = document.createElement('span');
    resX.textContent = x;
    resX.className = 'segment-x';
    
    const resY = document.createElement('span');
    resY.textContent = y.repeat(i);
    resY.className = 'segment-y';
    
    const resZ = document.createElement('span');
    resZ.textContent = z;
    resZ.className = 'segment-z';
    
    elements.resultVisualizer.appendChild(resX);
    elements.resultVisualizer.appendChild(resY);
    elements.resultVisualizer.appendChild(resZ);

    // Membership check
    const isInLanguage = state.selectedLanguage.check(pumpedString);
    elements.membershipResult.textContent = isInLanguage 
        ? `"${pumpedString}" ∈ L (Condition holds for i=${i})` 
        : `"${pumpedString}" ∉ L (CONTRADICTION FOUND for i=${i}!)`;
    
    elements.membershipResult.className = `status-indicator ${isInLanguage ? 'success' : 'failure'}`;

    updateAnalysisText(isInLanguage, i, x, y, z, pumpedString);
}

function updateAnalysisText(isInLanguage, i, x, y, z, pumped) {
    let text = `<strong>Current Decomposition:</strong><br>`;
    text += `x = "${x || 'ε'}", y = "${y}", z = "${z || 'ε'}"<br>`;
    text += `Constraints Check: |xy| = ${x.length + y.length} ≤ ${state.p} (OK), |y| = ${y.length} > 0 (OK).<br><br>`;

    if (state.selectedLanguage.isRegular) {
        text += `Since this language is <strong>Regular</strong>, the Pumping Lemma says there MUST exist a split (x, y, z) such that for ALL i ≥ 0, xyⁱz ∈ L. `;
        text += isInLanguage 
            ? `Your current choice works for i=${i}. Try other values of i to see if it holds.`
            : `Your current choice of y failed for i=${i}, but another split might work.`;
    } else {
        text += `Since this language is <strong>Non-Regular</strong>, the Pumping Lemma says that for EVERY possible split (x, y, z), there must be at least one i such that xyⁱz ∉ L. `;
        text += !isInLanguage 
            ? `<strong>SUCCESS!</strong> You found a contradiction for i=${i}. This proved that for THIS specific split, the pumping condition fails.`
            : `For this split, the condition holds for i=${i}. Try a different i (often 0 or 2+) to find a contradiction!`;
    }

    elements.explanationText.innerHTML = text;

    // Update the sidebar stats
    let sidebar = ``;
    sidebar += `<strong>Type:</strong> ${state.selectedLanguage.isRegular ? '<span style="color:var(--success-color)">Regular</span>' : '<span style="color:var(--error-color)">Non-Regular</span>'}<br><br>`;
    sidebar += `<strong>Current i:</strong> ${i}<br>`;
    sidebar += `<strong>Condition:</strong> ${isInLanguage ? '<span style="color:var(--success-color)">Held</span>' : '<span style="color:var(--error-color)">Failed</span>'}<br><br>`;
    sidebar += state.selectedLanguage.isRegular 
        ? `(We expect the condition to hold for all valid configurations.)` 
        : `(We are actively trying to find a configuration that fails.)`;
    
    if (elements.analysisSidebarText) {
        elements.analysisSidebarText.innerHTML = sidebar;
    }
}

// Start the app
init();
