class Splash {
  constructor() {
    this.splashBorder = 0;
    fill(300);
    stroke(0, 0, 0);
    rect(
      this.splashBorder,
      this.splashBorder,
      windowWidth - this.splashBorder * 2,
      windowHeight - this.splashBorder * 2
    );

    fill(0, 0, 222);
    strokeWeight(3);

    line(
      windowWidth - this.splashBorder - 40,
      this.splashBorder + 20,
      windowWidth - this.splashBorder - 20,
      this.splashBorder + 40
    );
    line(
      windowWidth - this.splashBorder - 20,
      this.splashBorder + 20,
      windowWidth - this.splashBorder - 40,
      this.splashBorder + 40
    );

    this.title = createDiv("SYNTHZIV SAMPLER");
    this.title.style("color:#673AB7");
    this.title.style("font-family: Arial, Helvetica, sans-serif");
    this.title.position(this.splashBorder + 20, this.splashBorder + 20);

    this.name = createDiv("Justin Zhang");
    this.name.position(this.splashBorder + 20, this.splashBorder + 60);

    this.info = createDiv(
      "Expanding upon the foundation of my midterm project—a sampled-based synthesizer—I have enhanced its functionality to create a more comprehensive synthesizer. One notable addition is the implementation of visualizers, which offer enhanced insight and clarity into the sounds being generated. This visual representation serves to augment the user experience, providing a more intuitive understanding of the synthesized audio output. <p> <a href=https://editor.p5js.org/justinzhangjx/sketches/X7cUEaf6N>view code</a>"
    );

    this.info.position(this.splashBorder + 20, this.splashBorder + 100);
    this.info.size(
      windowWidth - this.splashBorder * 2 - 50,
      windowHeight - this.splashBorder * 2 - 50
    );
  }

  update() {
    if (
      mouseX > windowWidth - this.splashBorder - 40 &&
      mouseX < windowWidth - this.splashBorder - 20 &&
      mouseY < this.splashBorder + 40 &&
      mouseY > this.splashBorder + 20
    ) {
      return true;
    }
  }

  hide() {
    this.title.remove();
    this.name.remove();
    this.info.remove();
  }
}
