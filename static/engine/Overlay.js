export class Overlay {

    static create(player) {
        const overlayHtml = `
            <div tabindex="-1" style="user-select: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
                <div style="text-align: center; color: white;">
                    <h1>hei</h1>
                    <p>You can add any HTML content here.</p>
					<button tabindex="-1" id="sex">hei</button>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = overlayHtml;
        document.body.appendChild(div);


			document.getElementById("sex").onclick = () => {
				player.velocity.x += 2000
			}
    }
}

