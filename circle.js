var vis = (function () {
  var stateKey,
    eventKey,
    keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange"
    };
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey];
      break;
    }
  }
  return function (c) {
    if (c) document.addEventListener(eventKey, c);
    return !document[stateKey];
  }
})();
$(document).ready(function () {
  // Main animation variables
  var holder = $(".home #hero-area"),
    circleTL = new TimelineMax(),
    circleRed = $(".circle-red"),
    circleProgress = 0;
  var quickScroll = true;
  var stopScroll = false;

  circleTL.to($(".circle-red"), 0, {
    drawSVG: circleProgress + "%",
    ease: Power0.easeNone
  });

  //Load videos

  var loadPrevious = function (n) {
    $(".koozi video").each(function (i) {
      if ($(this).hasClass("active")) {
        let indexing = i;
        let currentVideo = $(this);
        if (i != 0) {
          if (n) {
            if (n > 3) {
              n = 0;
            }
            setTimeout(function () {
              currentVideo.removeClass("active");
              $('.texty.stag:eq(' + i + ')').removeClass('active-text');
            }, 1000);
            let prevVideo = $(this).prev("video");
            indexing--;
            var lastRedCircle = $(".dot-red.active:last");
            for (let j = i - 1; j > n; j--) {
              prevVideo = prevVideo.prev("video");
              indexing--;
              circleTL
                .set(lastRedCircle, { className: "-=active" })
              lastRedCircle = $(".dot-red.active:last");
            }

            circleProgress = 25 * n;
            circleTL
              .add(function () {
                holder.addClass("animating");
                setTimeout(function () {
                  holder.removeClass("animating");
                }, 1600);
              })
              .set(lastRedCircle, { className: "-=active" }, "+=.2")
              .to(circleRed, 1.2, {
                drawSVG: circleProgress + "%",
                ease: Power0.easeNone
              })
              .add(function () {
                let video = prevVideo.get(0);
                video.currentTime = 0;
                prevVideo.addClass("active");
                $('.texty.stag:eq(' + indexing + ')').addClass('active-text');
              });
            clearInterval(interval);
            startAuto();
          } else {
            $(this).removeClass("active");
            $('.texty.stag:eq(' + i + ')').removeClass('active-text');
            let video = $(this)
              .prev("video")
              .get(0);
            video.currentTime = 0;
            $(this)
              .prev("video")
              .addClass("active");
            indexing--;
            $('.texty.stag:eq(' + indexing + ')').addClass('active-text');
          }
        }
      }
    });
  };

  var loadForward = function (n) {
    $(".koozi video").each(function (i) {
      if ($(this).hasClass("active")) {
        let indexing = i;
        $(this).next("video").currentTime = 0;
        let currentVideo = $(this);
        if (n) {   // this condition is required for click
          setTimeout(function () {
            currentVideo.removeClass("active");
            $('.texty.stag:eq(' + i + ')').removeClass('active-text');
          }, 1000);
          let nextVideo = $(this).next("video");
          indexing++;  //text
          var nextCircle = $(".dot-red.active:last").next(); //to fill small circle on a big circle
          for (let j = i + 1; j < n; j++) {
            nextVideo = nextVideo.next("video");
            indexing++;
            circleTL
              .set(nextCircle, { className: "+=active" });
            nextCircle = $(".dot-red.active:last").next();
          }
          circleProgress = 25 * n;
          circleTL
            .add(function () {
              holder.addClass("animating");
              setTimeout(function () {
                holder.removeClass("animating");
              }, 1600);
            })
            .to(circleRed, 1.2, {
              drawSVG: circleProgress + "%",
              ease: Power0.easeNone
            })
            .set(nextCircle, { className: "+=active" })
            .add(function () {
              let video = nextVideo.get(0);
              video.currentTime = 0;
              nextVideo.addClass("active");
              $('.texty.stag:eq(' + indexing + ')').addClass('active-text');
            });
          clearInterval(interval);
          startAuto();
        } else {
          $(this).removeClass("active");
          $('.texty.stag:eq(' + i + ')').removeClass('active-text');
          if ($(this).next("video").length) {
            let video = $(this)
              .next("video")
              .get(0);
            video.currentTime = 0;
            $(this)
              .next("video")
              .addClass("active");
            indexing++;
            $('.texty.stag:eq(' + indexing + ')').addClass('active-text');
          } else {
            let video = $(".koozi video")
              .first()
              .get(0);
            video.currentTime = 0;
            $(".koozi video")
              .first()
              .addClass("active");
            $('.texty.stag:eq(0)').addClass('active-text');
          }
        }

        if ($(".dot-red:last-child").hasClass("active")) {
          circleProgress = 0;

          if (isMobile || isBummer) {
          } else {
            var tlCoverIn = new TimelineMax();
            tlCoverIn
              .to(".active-cover .cover-outer", 0.001, { autoAlpha: 1 }, 0)
              .to(".active-cover .cover-inner", 0.001, { autoAlpha: 1 }, 0)
              .to(".prev-cover .cover-outer", 0.001, { autoAlpha: 0 }, 0)
              .to(".prev-cover .cover-inner", 0.001, { autoAlpha: 0 }, 0)
              .add("mctexty", "+=.25")
          }
          circleTL
            .to($(".circle-red"), 0.1, {
              drawSVG: "100%",
              ease: Power0.easeNone
            })
            .to(
              $(".circle-red"),
              0.01,
              { opacity: 0, ease: Power2.easeInOut },
              "-=.1"
            ).add(function () {
              holder.addClass("animating");
              setTimeout(function () {
                holder.removeClass("animating");
              }, 2000);
            })
            .set(
              $(".dot-red.active:not(:first-child)"),
              { className: "-=active" }
            )
            .to($(".circle-red"), 0, { drawSVG: circleProgress + "%" })
            .to($(".circle-red"), 0, { opacity: 1 });
          return;
        }
        return false;
      }
    });
  };

  var interval;
  var startAuto = function (a) {
    if (a) {
      stopScroll = true;
      circleForward();
    }
    interval = setInterval(function () {
      circleForward();
    }, 6000);
  };
  startAuto();
  // loadForward(1);

  function circleForward() {
    var nextCircle = $(".dot-red.active:last").next();
    circleProgress = circleProgress + 25;
    circleTL
      .add(function () {
        holder.addClass("animating");
        setTimeout(function () {
          stopScroll = false;
        }, 1700)
        setTimeout(function () {
          holder.removeClass("animating");
        }, 1600);
      })
      .to(circleRed, 1.2, {
        drawSVG: circleProgress + "%",
        ease: Power0.easeNone
      })
      .set(nextCircle, { className: "+=active" })
      .add(function () {
        loadForward();

      });
  }

  function circleBack() {
    var farthestDotNum = $(".dot-red.active:last").index() - 1;
    var lastRedCircle = $(".dot-red.active:last");
    circleProgress = circleProgress - 25;
    circleTL
      .add(function () {
        holder.addClass("animating");
        setTimeout(function () {
          stopScroll = false;
        }, 1700)
        setTimeout(function () {
          holder.removeClass("animating");
        }, 1600);
      })
      .set(lastRedCircle, { className: "-=active" })
      .to(circleRed, 1.2, {
        drawSVG: circleProgress + "%",
        ease: Power0.easeNone
      })
      .add(function () {
        loadPrevious();
      });
  }

  $(".st7").click(function () {
    var thisDotNum = $(this).index(),
      farthestDotNum = $(".dot-red.active:last").index();
    let currentDotNum;
    if (thisDotNum > 3) {
      currentDotNum = thisDotNum;
      thisDotNum = 0;
    }
    if (holder.hasClass("animating")) {
      return;
    }
    var goThisFar = thisDotNum - farthestDotNum,
      staggerDur = 1.2 / goThisFar;

    if (goThisFar > 0) {
      loadForward(thisDotNum);
    } else if (goThisFar < 0) {
      if (currentDotNum) {
        loadPrevious(currentDotNum);
      } else {
        loadPrevious(thisDotNum);
      }
    }

  });
  //last code
  $(".hero-view").on("wheel", function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    if (
      holder.hasClass("animating") ||
      holder.hasClass("viewing-menu") ||
      !holder.hasClass("all-loaded")
    ) {
      return false;
    }
    if (!stopScroll) {
      var delta = e.originalEvent.deltaY;
      if (delta > 0) {
        let a = true;
        clearInterval(interval);
        startAuto(a);
      } else if (delta < 0) {
        if (circleProgress != 0) {
          clearInterval(interval);
          setTimeout(function () {
            quickScroll = true
          }, 1800);
          console.log(quickScroll)
          if (quickScroll) {
            circleBack();
          }
          quickScroll = false
          startAuto();
        }
      }
    }
  });

  //Broser tab change
  vis(function () {
    if (vis()) {
      startAuto();
    } else {
      clearInterval(interval);
    }
  });

});
