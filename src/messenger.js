export function showMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
}