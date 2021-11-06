
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      const START = 0;
      const STARTING = 1;
      const RUNNING = 2;
      const PAUSE = 3;
      const END = 4;


      const IMAGES = {
        bg: "https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062734/background_cqryex.png",
        // chick_frame_live: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062734/chick_lav6zu.png"],
        chick_frame_live: ["bu.png"],
        // e1_live: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062734/egg1_zjwoyk.png"],
        e1_live: ["cookie.png"],
        e1_death: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062735/noegg_pgslgi.png"],
        e2_live: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062734/egg2_kuozg7.png"],
        e2_death: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062735/noegg_pgslgi.png"],
        e3_live: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062734/egg3_lq7ap8.png"],
        e3_death: ["https://res.cloudinary.com/dnfcywx3w/image/upload/v1633062735/noegg_pgslgi.png"],
      };


      const bg = createImage(IMAGES.bg);
      const chick_frame = {
        live: createImage(IMAGES.chick_frame_live),
      };
      const e1 = {
        live: createImage(IMAGES.e1_live),
        death: createImage(IMAGES.e1_death),
      };
      const e2 = {
        live: createImage(IMAGES.e2_live),
        death: createImage(IMAGES.e2_death),
      };
      const e3 = {
        live: createImage(IMAGES.e3_live),
        death: createImage(IMAGES.e3_death),
      };


      function createImage(src) {
        let img;
        if (typeof src === "string") {
          img = new Image();
          img.src = src;
        } else {
          img = [];
          for (let i = 0; i < src.length; i++) {
            img[i] = new Image();
            img[i].src = src[i];
          }
        }
        return img;
      }


      const BLANK = {
        bg: bg,
        width: 480,
        height: 650,
      };


      const CHICK = {
        frame: chick_frame,
        width: 66,
        height: 82,
      };


      const E1 = { type: 1, width: 57, height: 51, life: 1, score: 1, frame: e1};
      const E2 = { type: 2, width: 57, height: 51, life: 1, score: 2, frame: e2};
      const E3 = { type: 3, width: 57, height: 51, life: 1, score: 3, frame: e3};


      class Blank {
        constructor(config) {
          this.bg = config.bg;
          this.width = config.width;
          this.height = config.height;
          this.x1 = 0;
          this.y1 = 0;
          this.x2 = 0;
          this.y2 = -this.height;
        }
        paint(context) {
          context.drawImage(this.bg, this.x1, this.y1, this.width, this.height);
          context.drawImage(this.bg, this.x2, this.y2, this.width, this.height);
        }
      }


      class Chick {
        constructor(config) {
          this.width = config.width;
          this.height = config.height;
          this.x = (480 - config.width) / 2;
          this.y = 1000;
          this.frame = config.frame;
          this.img = null;
          this.live = true;
          this.destory = false;
        }
        judge() {
            if (this.live) {
              this.img = this.frame.live[0];
            } else {
                this.destory = true;
            }
          if(!this.live){
            this.destory = true;
          }
        }
        paint(context) {
          context.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        collide() {
          this.live = false;
          this.destory = true;
        }
        bonus(){
          this.live = true;
        }
      }



      class Egg {
        constructor(config) {
          this.width = config.width;
          this.height = config.height;
          this.x = Math.floor(Math.random() * (480 - config.width));
          this.y = -config.height;
          this.life = config.life;
          this.score = config.score;
          this.frame = config.frame;
          this.img = this.frame.live[0];
          this.live = true;
          this.destory = false;
        }
        move() {
            if (this.live) {
              this.img = this.frame.live[0];
              this.y++;
            } else {
              this.img = this.frame.death[0]; 
              this.destory = true;
            }
        }
        paint(context) {
          context.drawImage(this.img, this.x, this.y);
        }
        outOfBounds() {
          if (this.y > 650) {
            return true;
          }
        }
        hit(o) {
          let ol = o.x;
          let or = o.x + o.width;
          let ot = o.y;
          let ob = o.y + o.height;
          let el = this.x;
          let er = this.x + this.width;
          let et = this.y;
          let eb = this.y + this.height;
          if (ol > er || or < el || ot > eb || ob < et) {
            return false;
          } else {
            return true;
          }
        }
        collide() {
          this.life--;
          if (this.life === 0) {
            this.live = false;
            score += this.score;
          }
        }
      }


      const blank = new Blank(BLANK);
      let chick = new Chick(CHICK);
      let state = START;
      let score = 0;
      let life = 3;


      document.getElementById("startHint").addEventListener("click", function() {
        if (state === START) {
          state = RUNNING;
        }else if(state === PAUSE){
          state = END;
        }
      });


      canvas.addEventListener("click", (e) => {
        let x = e.offsetX;
        let y = 0;
        chick.x = x - chick.width / 2;
        chick.y = 530;
      });

      canvas.addEventListener("mouseleave", () => {
        if (state === RUNNING) {
          state = PAUSE;
        }
      });

      canvas.addEventListener("mouseenter", () => {
        if (state === PAUSE) {
          state = RUNNING;
        }
      });

      function checkHit() {
          for (let i = 0; i < eggs.length; i++) {
              if (eggs[i].hit(chick)) {
                  eggs[i].collide();
                  chick.bonus();
              }else if(eggs[i].outOfBounds()){
                  chick.collide();
              }
          }
      }


      let eggs = [];

      let EGG_CREATE_INTERVAL = 1000;
      let EGG_LASTTIME = new Date().getTime();
      let count = 0;

      function bestScore(){ 
        if(typeof(Storage) !== "undefined"){
          
          if (score > 0) {
            if(typeof(localStorage.bscore) == "undefined"){
              localStorage.bscore = score;
              localStorage.blife = life; 
            }else if (localStorage.bscore < score){
              localStorage.bscore = score;
              localStorage.blife = life;}}

          localStorage.setItem("Bestscore", localStorage.bscore);
          localStorage.setItem("Lifeleft", localStorage.blife);
          document.getElementById("instruction").innerHTML = "Your best score is " + localStorage.getItem("Bestscore") + " with " + localStorage.getItem("Lifeleft") + " life left.";
        }else{
          document.getElementById("recordScore").innerHTML = "Please use Chrome.";
        }
      }

      function createComponent() {
          const currentTime = new Date().getTime();
          
          timeGone = currentTime - EGG_LASTTIME;
          if(timeGone <= 15000){  
              let ran1 = Math.floor(Math.random() * 1000);
              if (ran1 < 10) { eggs.push(new Egg(E1)); } 
          }
          else if(timeGone > 15000 && timeGone <= 30000){
              let ran2 = Math.floor(Math.random() * 1000);
              if (ran2 < 10) { eggs.push(new Egg(E1)); }
              else if(ran2 >= 10 && ran2 < 15) {eggs.push(new Egg(E2));}
          }
          else if(timeGone > 30000 && timeGone <=300000){
              let ran2 = Math.floor(Math.random() * 1000);
              if (ran2 < 10) { eggs.push(new Egg(E1)); }
              else if(ran2 >= 10 && ran2 < 15) {eggs.push(new Egg(E2));}
              else if(ran2 >= 15 && ran2 < 17) {eggs.push(new Egg(E3));}
          }else{
              state = END;
          }

      }

      function judgeComponent() {
          for (let i = 0; i < eggs.length; i++) {
              eggs[i].move();
          }
      }


      function paintComponent() {

        for (let i = 0; i < eggs.length; i++) {
          eggs[i].paint(context);
        }
        context.textAlign = "left";
        context.textAlign = "right";

      }


      function deleteComponent() {
        for (let i = 0; i < eggs.length; i++) {
            if (eggs[i].outOfBounds()) {
                life --;
                eggs.splice(i, 1);
                if(life === 0){
                    state = END;
                }
            }
        }
      }


      bg.addEventListener("load", () => {
        setInterval(() => {
          switch (state) {
            case START:
              document.getElementById("startHint").innerHTML = "Click to start";
              break;
            case RUNNING:
              document.getElementById("instruction").innerHTML = "Click canvas to place the chick";
              document.getElementById("startHint").innerHTML = "Click to quit";
              blank.paint(context);
              chick.judge();
              chick.paint(context);
              createComponent();
              checkHit();
              judgeComponent();
              deleteComponent();
              paintComponent();
              document.getElementById("metrics").innerHTML = "Current score:" + score + "&nbsp" + "&nbsp"+ "&nbsp"+ "&nbsp"+ "Life:" + life;
              break;
            case PAUSE:
              break;
            case END:
              document.getElementById("startHint").innerHTML = " Good job! ";
              bestScore();
              context.font = "bold 24px serif";
              context.textAlign = "center";
              context.textBaseline = "middle";
              context.fillText("GAME OVER!", 480 / 2, 650 / 2);
              document.getElementById("metrics").innerHTML = "You currently got " + score + "&nbsp" + "scores with " + life + "&nbsp" + "life left.";
              break;
          }
        }, 7);
      });
