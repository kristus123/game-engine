const html = `
<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    overflow: auto; /* Add scrollbar when content overflows */
    max-height: 80vh; /* Limit maximum height to 80% of viewport height */
  }
  .grid-item {
    background-color: #ccc;
    padding: 20px;
    text-align: center;
    height:100px;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .box {
    width: 600px;
    padding: 20px;
    box-sizing: border-box;
    margin: 20px;
  }
</style>

<div tabindex="-1" style="user-select: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">

  <div style="text-align: center; color: white;">
    <div class="container">
      <div class="box" style="background-color: black;">
        <h1>hei</h1>
      </div>
      <div class="box" style="background-color: white;">
        <div class="grid-container">
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
          <div class="grid-item">Task 1</div>
        </div>
      </div>
    </div>
  </div>
</div>

`
export class Overlay {
    static create(player) {
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
    }

	static follow(player) {
	}
}
