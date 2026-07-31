(function () {
  "use strict";

  var data = window.LP_CONTENT;
  if (!data) return;
  function escLines(value) {
    return esc(value)
      .replace(/（税抜）(?:\\n|\r\n|\n|\s+)(?=\S)/g, "（税抜）<br>")
      .replace(/\\n|\r\n|\n/g, "<br>");
  }

  function tabLabel(value) {
    return esc(value)
      .replace(/\\n|\r\n|\n/g, "\n")
      .split("\n")
      .map(function (line) {
        var className = /^（.*）$/.test(line) ? "tab-level" : "tab-title";
        return '<span class="' + className + '">' + line + '</span>';
      })
      .join("");
  }
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function imageStyle(path) {
    return "background-image:url('" + path + "')";
  }

  document.getElementById("vision-grid").innerHTML = data.visions.map(function (item) {
    return [
      '<article class="vision-card">',
      '<div class="vision-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.title), '"></div>',
      '<div class="vision-body"><h3>', esc(item.title), '</h3><p>', esc(item.text), "</p></div>",
      "</article>"
    ].join("");
  }).join("");

  document.getElementById("lead-copy").innerHTML = data.leadParagraphs.map(function (text) {
    return "<p>" + esc(text) + "</p>";
  }).join("");

  document.getElementById("practice-list").innerHTML = data.practices.map(function (item, index) {
    return [
      '<article class="practice-row', index % 2 ? " reverse" : "", '">',
      '<div class="practice-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.title), '"></div>',
      '<div class="practice-copy"><p class="practice-number"><span>POINT</span><strong>', esc(item.number), "</strong></p>",
      item.tag ? '<span class="practice-tag">' + esc(item.tag) + "</span>" : "",
      "<h3>", esc(item.title), "</h3><p>", esc(item.text), "</p></div>",
      "</article>"
    ].join("");
  }).join("");

  document.getElementById("support-grid").innerHTML = data.supports.map(function (item) {
    return [
      '<article class="support-card" data-mark="', esc(item.mark), '"><span class="support-mark"><span>Support</span>', esc(item.mark), "</span>",
      "<h3>", esc(item.title), "</h3><p>", esc(item.text), "</p></article>"
    ].join("");
  }).join("");

  var tabs = document.getElementById("course-tabs");
  var panels = document.getElementById("course-panels");

  tabs.innerHTML = data.courses.map(function (course, index) {
    return [
      '<button type="button" role="tab" id="tab-', esc(course.id), '" aria-controls="panel-', esc(course.id),
      '" aria-selected="', index === 0 ? "true" : "false", '" tabindex="', index === 0 ? "0" : "-1", '">',
      tabLabel(course.tab), "</button>"
    ].join("");
  }).join("");

  panels.innerHTML = data.courses.map(function (course, index) {
    var details = course.details.map(function (detail) {
var detailValue = escLines(detail[1]);
      if (detail[0] === "取得できる資格" && detail[1].indexOf("\n") !== -1) {
        var certificateLines = detail[1].split("\n");
        detailValue = '<span class="course-certificate-issuer">' + esc(certificateLines[0]) + '</span><span class="course-certificate-name">' + esc(certificateLines.slice(1).join(" ")) + '</span>';
      }
      if (detail[0] === "取得できる資格") {
        detailValue += '<img class="course-certificate-image" src="' + esc(course.certificateImage) + '" alt="卒業証書の見本">';
      }
      if (detail[0] === "費用") {
        detailValue += '<span class="course-loan-fee-note">※日本整体師育成専門学院では<br>　国の教育ローンをご利用いただけます。</span>';
      }      return "<div><dt>" + esc(detail[0]) + "</dt><dd>" + detailValue + "</dd></div>";
    }).join("");
    var items = course.items.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("");
    return [
      '<section class="course-panel" role="tabpanel" id="panel-', esc(course.id), '" aria-labelledby="tab-', esc(course.id), '"',
      index === 0 ? "" : " hidden", ">",
      '<div class="course-photo" style="', imageStyle(course.image), '" role="img" aria-label="', esc(course.name), '"></div>',
      '<div class="course-copy"><p class="course-ribbon">', esc(course.ribbon), "</p>",
      "<h3>", esc(course.name), "</h3><p>", esc(course.description), "</p>",
      '<dl class="course-details">', details, '</dl><ul>', items, '</ul></div>' ,
      "</section>"
    ].join("");
  }).join("");

  function activateTab(nextTab) {
    Array.from(tabs.querySelectorAll('[role="tab"]')).forEach(function (tab) {
      var active = tab === nextTab;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
    });
  }

  tabs.addEventListener("click", function (event) {
    var tab = event.target.closest('[role="tab"]');
    if (tab) activateTab(tab);
  });

  tabs.addEventListener("keydown", function (event) {
    var list = Array.from(tabs.querySelectorAll('[role="tab"]'));
    var index = list.indexOf(event.target);
    var next;
    if (event.key === "ArrowRight") next = (index + 1) % list.length;
    if (event.key === "ArrowLeft") next = (index - 1 + list.length) % list.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = list.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    activateTab(list[next]);
    list[next].focus();
  });


  var licenseTabs = document.getElementById("license-course-tabs");
  var licensePanels = document.getElementById("license-course-panels");

  if (licenseTabs && licensePanels && data.licenseCourses) {
    licenseTabs.innerHTML = data.licenseCourses.map(function (course, index) {
      return [
        '<button type="button" role="tab" id="tab-', esc(course.id), '" aria-controls="panel-', esc(course.id),
        '" aria-selected="', index === 0 ? "true" : "false", '" tabindex="', index === 0 ? "0" : "-1", '">',
        tabLabel(course.tab), "</button>"
      ].join("");
    }).join("");

    licensePanels.innerHTML = data.licenseCourses.map(function (course, index) {
      var details = course.details.map(function (detail) {
        return "<div><dt>" + esc(detail[0]) + "</dt><dd>" + escLines(detail[1]) + "</dd></div>";
      }).join("");
      var items = course.items.map(function (item) {
        return "<li>" + esc(item) + "</li>";
      }).join("");
      return [
        '<section class="sub-course-panel" role="tabpanel" id="panel-', esc(course.id), '" aria-labelledby="tab-', esc(course.id), '"',
        index === 0 ? "" : " hidden", ">",
        '<div class="sub-course-copy"><p class="sub-course-ribbon">', esc(course.ribbon), "</p>",
        "<h4>", esc(course.name), "</h4><p>", esc(course.description), "</p>",
        '<dl class="sub-course-details">', details, "</dl><ul>", items, "</ul>",
        "</div></section>"
      ].join("");
    }).join("");

    function activateLicenseTab(nextTab) {
      Array.from(licenseTabs.querySelectorAll('[role="tab"]')).forEach(function (tab) {
        var active = tab === nextTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
      });
    }

    licenseTabs.addEventListener("click", function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (tab) activateLicenseTab(tab);
    });

    licenseTabs.addEventListener("keydown", function (event) {
      var list = Array.from(licenseTabs.querySelectorAll('[role="tab"]'));
      var index = list.indexOf(event.target);
      var next;
      if (event.key === "ArrowRight") next = (index + 1) % list.length;
      if (event.key === "ArrowLeft") next = (index - 1 + list.length) % list.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = list.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activateLicenseTab(list[next]);
      list[next].focus();
    });
  }
  var head = "<thead><tr>" + data.comparison.headers.map(function (header) {
    return '<th scope="col">' + esc(header) + "</th>";
  }).join("") + "</tr></thead>";

  function comparisonCell(cell) {
    var text = String(cell);
    var match = text.match(/^([◎○△ー])\n([\s\S]*)$/);
    if (!match) return esc(text);

    var markClass = match[1] === "◎" ? "double" : match[1] === "○" ? "circle" : match[1] === "△" ? "triangle" : "dash";
    return [
      '<span class="comparison-mark comparison-mark-', markClass, '">', esc(match[1]), "</span>",
      '<span class="comparison-text">', esc(match[2]).replace("eラーニング・復習環境も完備", '<span class="comparison-highlight">eラーニング・復習環境も完備</span>'), "</span>"
    ].join("");
  }

  var body = "<tbody>" + data.comparison.rows.map(function (row) {
    return '<tr><th scope="row">' + esc(row[0]) + "</th>" + row.slice(1).map(function (cell) {
      return "<td>" + comparisonCell(cell) + "</td>";
    }).join("") + "</tr>";
  }).join("") + "</tbody>";
  document.getElementById("comparison-table").innerHTML = head + body;

document.getElementById("graduate-list").innerHTML = data.graduates.map(function (item) {
    if (item.body) {
      return [
        '<article class="graduate-voice-card">',
        '<div class="graduate-voice-person">',
        '<img src="', esc(item.photo), '" alt="', esc(item.name), '">',
'</div>',
        '<div class="graduate-voice-content graduate-voice-article">',
        '<h3>', esc(item.heading), '</h3>',
        '<p class="graduate-voice-profile">', escLines(item.profile), '</p>',
        '<div class="graduate-voice-body">',
        item.body.map(function (paragraph) {
          var paragraphHtml = esc(paragraph);
          (item.keywords || []).forEach(function (keyword) {
            var safeKeyword = esc(keyword);
            paragraphHtml = paragraphHtml.split(safeKeyword).join('<strong>' + safeKeyword + '</strong>');
          });
          return ['<p>', paragraphHtml, '</p>'].join("");
        }).join(""),
        '</div>',
        '</div>',
        '</article>'
      ].join("");
    }
    return [
      '<article class="graduate-card">',
      '<div class="graduate-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.headline), '"></div>',
      '<div class="graduate-copy"><h3>', esc(item.headline), "</h3><p class=\"graduate-meta\">", esc(item.meta), "</p>",
      '<p class="graduate-summary">', esc(item.text), "</p>",
      '<button type="button" aria-expanded="false" aria-controls="graduate-detail-', item.name || '', '">詳しく見る</button>',
      "</div></article>"
    ].join("");
  }).join("");

  document.getElementById("graduate-list").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    var detail = document.getElementById(button.getAttribute("aria-controls"));
    var open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "閉じる" : "詳しく見る";
    detail.hidden = !open;
  });

  document.getElementById("faq-list").innerHTML = data.faq.map(function (item) {
    return [
      '<details class="faq-item"><summary><span>Q</span>', esc(item.q), "</summary>",
      '<div class="faq-answer"><span>A</span><p>', esc(item.a), "</p></div></details>"
    ].join("");
  }).join("");

  var requestForm = document.getElementById("request-form");
  var purposeInputs = requestForm ? Array.from(requestForm.querySelectorAll('input[name="request-purpose"]')) : [];
  var experienceToggle = document.getElementById("experience-toggle");
  var experienceFields = document.getElementById("experience-fields");
  var experienceDate = document.getElementById("experience-date");
  var postalAddressButton = document.getElementById("postal-address-button");

  function syncExperienceFields() {
    var showExperience = Boolean(experienceToggle && experienceToggle.checked);
    if (experienceFields) experienceFields.hidden = !showExperience;
    if (experienceDate) {
      experienceDate.required = showExperience;
      if (!showExperience) experienceDate.setCustomValidity("");
    }
  }

  purposeInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      if (purposeInputs.some(function (item) { return item.checked; })) {
        purposeInputs[0].setCustomValidity("");
      }
      syncExperienceFields();
    });
  });

  if (postalAddressButton && requestForm) {
    postalAddressButton.addEventListener("click", async function () {
      var postalInput = requestForm.querySelector('[name="postal-code"]');
      var address = document.getElementById("address");
      var formStatus = document.getElementById("form-status");
      var postalCode = postalInput ? postalInput.value.replace(/[^0-9]/g, "") : "";
      var defaultLabel = postalAddressButton.textContent;

      if (postalInput) postalInput.value = postalCode;
      if (postalCode.length !== 7) {
        if (postalInput) {
          postalInput.setCustomValidity("郵便番号は7桁の数字で入力してください。");
          postalInput.reportValidity();
          postalInput.setCustomValidity("");
        }
        if (formStatus) formStatus.textContent = "郵便番号を7桁で入力してください。";
        return;
      }

      postalAddressButton.disabled = true;
      postalAddressButton.textContent = "検索中…";
      if (formStatus) formStatus.textContent = "住所を検索しています…";

      try {
        var response = await fetch("https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + encodeURIComponent(postalCode));
        if (!response.ok) throw new Error("Address lookup failed");
        var result = await response.json();
        var location = result && result.results && result.results[0];
        if (!location) throw new Error("Address not found");

        if (address) {
          address.value = [location.address1, location.address2, location.address3].filter(Boolean).join("");
          address.focus();
        }
        if (formStatus) formStatus.textContent = "都道府県・市区町村を自動入力しました。番地・建物名をご入力ください。";
      } catch (error) {
        if (formStatus) formStatus.textContent = "住所を取得できませんでした。郵便番号をご確認のうえ、ご住所を入力してください。";
      } finally {
        postalAddressButton.disabled = false;
        postalAddressButton.textContent = defaultLabel;
      }
    });
  }

  if (requestForm) {
    requestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!purposeInputs.some(function (item) { return item.checked; })) {
        purposeInputs[0].setCustomValidity("資料請求または見学・体験希望を選択してください。");
        purposeInputs[0].reportValidity();
        return;
      }
      purposeInputs[0].setCustomValidity("");
      document.getElementById("form-status").textContent =
        "デモフォームのため送信していません。本番公開時に送信先を接続してください。";
    });
  }

  syncExperienceFields();

  var profileTabs = document.querySelector(".student-profile-tabs");
  var profileCards = Array.from(document.querySelectorAll(".student-profile-card"));
  var profileGrid = document.querySelector(".student-profile-grid");
  var profileTouchSurface = document.querySelector(".student-profile-viewport") || profileGrid;
  var profilePosition = document.getElementById("student-profile-position");
  var profilePrev = document.querySelector(".student-profile-arrow-prev");
  var profileNext = document.querySelector(".student-profile-arrow-next");

  if (profileTabs && profileGrid && profileCards.length) {
    var profileTabList = Array.from(profileTabs.querySelectorAll('[role="tab"]'));
    var profileMobile = window.matchMedia("(max-width: 767px)");
    var profileIndex = 0;
    var profilePhysicalIndex = 1;
    var profileAnimating = false;
    var profileAnimationTimer = 0;
    var profileResetFrame = 0;
    var profileTouchStartX = 0;
    var profileTouchStartY = 0;
    var profileTouchStartTime = 0;
    var profileTouchDeltaX = 0;
    var profileDragging = false;

    var profileLastClone = profileCards[profileCards.length - 1].cloneNode(true);
    var profileFirstClone = profileCards[0].cloneNode(true);
    profileLastClone.classList.add("profile-loop-clone-last");
    profileFirstClone.classList.add("profile-loop-clone-first");
    [profileLastClone, profileFirstClone].forEach(function (clone) {
      clone.removeAttribute("id");
      clone.removeAttribute("aria-labelledby");
      clone.setAttribute("aria-hidden", "true");
      clone.classList.add("is-clone");
      clone.classList.remove("is-active");
    });
    profileGrid.insertBefore(profileLastClone, profileCards[0]);
    profileGrid.appendChild(profileFirstClone);

    function setProfileCloneActive(activeClone) {
      [profileLastClone, profileFirstClone].forEach(function (clone) {
        var active = clone === activeClone;
        clone.classList.toggle("is-active", active);
        clone.setAttribute("aria-hidden", String(!active));
      });
    }

    function setProfileTransform(animate, dragOffset) {
      if (!profileMobile.matches) {
        profileGrid.classList.remove("is-dragging");
        profileGrid.style.transform = "";
        return;
      }
      profileGrid.classList.toggle("is-dragging", !animate);
      var offset = typeof dragOffset === "number" ? dragOffset : 0;
      profileGrid.style.transform = "translate3d(calc(" + (-profilePhysicalIndex * 100) + "% + " + offset + "px), 0, 0)";
    }

    function updateProfileState(nextIndex) {
      profileIndex = (nextIndex + profileCards.length) % profileCards.length;
      profileTabList.forEach(function (tab, index) {
        var active = index === profileIndex;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        profileCards[index].classList.toggle("is-active", active);
        if (profileMobile.matches) profileCards[index].setAttribute("aria-hidden", String(!active));
        else profileCards[index].removeAttribute("aria-hidden");
      });
      if (profilePosition) profilePosition.textContent = (profileIndex + 1) + " / " + profileCards.length;
    }

    function finishProfileAnimation() {
      window.clearTimeout(profileAnimationTimer);
      var resetPhysicalIndex = null;
      if (profilePhysicalIndex === 0) resetPhysicalIndex = profileCards.length;
      if (profilePhysicalIndex === profileCards.length + 1) resetPhysicalIndex = 1;

      if (resetPhysicalIndex !== null) {
        window.cancelAnimationFrame(profileResetFrame);
        profileGrid.classList.add("is-loop-resetting");
        profileResetFrame = window.requestAnimationFrame(function () {
          profilePhysicalIndex = resetPhysicalIndex;
          setProfileTransform(false, 0);
          profileGrid.getBoundingClientRect();
          profileResetFrame = window.requestAnimationFrame(function () {
            profileGrid.classList.remove("is-loop-resetting");
            setProfileCloneActive(null);
            profileAnimating = false;
          });
        });
        return;
      }

      setProfileCloneActive(null);
      profileAnimating = false;
    }

    function queueProfileAnimationFinish() {
      window.clearTimeout(profileAnimationTimer);
      profileAnimationTimer = window.setTimeout(finishProfileAnimation, 420);
    }

    function goToProfile(nextIndex, animate) {
      setProfileCloneActive(null);
      profilePhysicalIndex = nextIndex + 1;
      updateProfileState(nextIndex);
      profileAnimating = Boolean(animate && profileMobile.matches);
      setProfileTransform(Boolean(animate), 0);
      if (profileAnimating) queueProfileAnimationFinish();
    }

    function moveProfile(step) {
      if (profileAnimating) return;
      var loopClone = null;
      if (profileIndex === 0 && step < 0) loopClone = profileLastClone;
      if (profileIndex === profileCards.length - 1 && step > 0) loopClone = profileFirstClone;
      setProfileCloneActive(loopClone);
      profilePhysicalIndex += step;
      updateProfileState(profileIndex + step);
      profileAnimating = true;
      setProfileTransform(true, 0);
      queueProfileAnimationFinish();
    }

    function activateProfileTab(nextTab) {
      var nextIndex = profileTabList.indexOf(nextTab);
      if (nextIndex >= 0) goToProfile(nextIndex, true);
    }

    profileTabs.addEventListener("click", function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (tab) activateProfileTab(tab);
    });

    profileTabs.addEventListener("keydown", function (event) {
      var index = profileTabList.indexOf(event.target);
      var next;
      if (event.key === "ArrowRight") next = (index + 1) % profileTabList.length;
      if (event.key === "ArrowLeft") next = (index - 1 + profileTabList.length) % profileTabList.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = profileTabList.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      goToProfile(next, true);
      profileTabList[next].focus();
    });

    if (profilePrev) profilePrev.addEventListener("click", function () { moveProfile(-1); });
    if (profileNext) profileNext.addEventListener("click", function () { moveProfile(1); });

    profileGrid.addEventListener("transitionend", function (event) {
      if (event.target === profileGrid && event.propertyName === "transform") finishProfileAnimation();
    });

    profileTouchSurface.addEventListener("touchstart", function (event) {
      if (!profileMobile.matches || profileAnimating || event.touches.length !== 1) return;
      profileTouchStartX = event.touches[0].clientX;
      profileTouchStartY = event.touches[0].clientY;
      profileTouchStartTime = Date.now();
      profileTouchDeltaX = 0;
      profileDragging = false;
    }, { passive: true });

    profileTouchSurface.addEventListener("touchmove", function (event) {
      if (!profileMobile.matches || profileAnimating || event.touches.length !== 1) return;
      var deltaX = event.touches[0].clientX - profileTouchStartX;
      var deltaY = event.touches[0].clientY - profileTouchStartY;
      if (!profileDragging && Math.abs(deltaX) < 3) return;
      if (!profileDragging && Math.abs(deltaX) <= Math.abs(deltaY) * .9) return;
      profileDragging = true;
      profileTouchDeltaX = deltaX;
      var dragClone = null;
      if (profileIndex === 0 && deltaX > 0) dragClone = profileLastClone;
      if (profileIndex === profileCards.length - 1 && deltaX < 0) dragClone = profileFirstClone;
      setProfileCloneActive(dragClone);
      event.preventDefault();
      setProfileTransform(false, deltaX);
    }, { passive: false });

    function finishProfileTouch() {
      if (!profileDragging) return;
      var elapsed = Math.max(Date.now() - profileTouchStartTime, 1);
      var velocity = Math.abs(profileTouchDeltaX) / elapsed;
      var threshold = Math.min(36, profileGrid.clientWidth * .1);
      var shouldMove = Math.abs(profileTouchDeltaX) >= threshold || velocity > .25;
      profileDragging = false;
      if (shouldMove) moveProfile(profileTouchDeltaX < 0 ? 1 : -1);
      else {
        profileAnimating = true;
        setProfileTransform(true, 0);
        queueProfileAnimationFinish();
      }
    }

    profileTouchSurface.addEventListener("touchend", finishProfileTouch, { passive: true });
    profileTouchSurface.addEventListener("touchcancel", finishProfileTouch, { passive: true });

    function refreshProfileLayout() {
      window.cancelAnimationFrame(profileResetFrame);
      profileGrid.classList.remove("is-loop-resetting");
      setProfileCloneActive(null);
      profilePhysicalIndex = profileIndex + 1;
      updateProfileState(profileIndex);
      setProfileTransform(false, 0);
    }
    if (profileMobile.addEventListener) profileMobile.addEventListener("change", refreshProfileLayout);
    else profileMobile.addListener(refreshProfileLayout);
    refreshProfileLayout();
  }

  var instructorSlider = document.querySelector("[data-instructor-slider]");
  if (instructorSlider) {
    var instructorViewport = instructorSlider.querySelector(".instructor-slider-viewport");
    var instructorTrack = instructorSlider.querySelector(".instructor-slider-track");
    var instructorSlides = Array.from(instructorSlider.querySelectorAll(".instructor-grid > .instructor-card"));
    var compactInstructorGroup = instructorSlider.querySelector(".compact-instructor-grid");
    if (compactInstructorGroup) instructorSlides.push(compactInstructorGroup);
    var instructorPrev = instructorSlider.querySelector(".instructor-slider-prev");
    var instructorNext = instructorSlider.querySelector(".instructor-slider-next");
    var instructorPosition = instructorSlider.querySelector(".instructor-slider-position span");
    var instructorIndex = 0;
    var instructorPhysicalIndex = 1;
    var instructorAnimating = false;
    var instructorAnimationTimer = 0;
    var instructorStartX = 0;
    var instructorStartY = 0;
    var instructorDeltaX = 0;
    var instructorSwiping = false;
    var instructorResizeTimer = 0;

    var instructorLastClone = instructorSlides[instructorSlides.length - 1].cloneNode(true);
    var instructorFirstClone = instructorSlides[0].cloneNode(true);
    [instructorLastClone, instructorFirstClone].forEach(function (clone) {
      clone.setAttribute("aria-hidden", "true");
      clone.classList.add("is-clone");
      clone.classList.remove("is-active");
    });
    instructorTrack.insertBefore(instructorLastClone, instructorTrack.firstChild);
    instructorTrack.appendChild(instructorFirstClone);

    function updateInstructorHeight() {
      if (!instructorViewport || !instructorSlides[0]) return;
      var instructorCards = Array.from(instructorSlider.querySelectorAll(".instructor-slider-track .instructor-card"));
      instructorCards.forEach(function (slide) { slide.style.height = ""; });
      instructorViewport.style.height = "";
      var referenceHeight = instructorSlides[0].offsetHeight;
      instructorCards.forEach(function (slide) { slide.style.height = referenceHeight + "px"; });
      instructorViewport.style.height = referenceHeight + "px";
    }

    function setInstructorTransform(animate, dragOffset) {
      instructorTrack.classList.toggle("is-dragging", !animate);
      var offset = typeof dragOffset === "number" ? dragOffset : 0;
      instructorTrack.style.transform = "translate3d(calc(" + (-instructorPhysicalIndex * 100) + "% + " + offset + "px), 0, 0)";
    }

    function updateInstructorState(nextIndex) {
      instructorIndex = (nextIndex + instructorSlides.length) % instructorSlides.length;
      instructorSlides.forEach(function (slide, index) {
        var active = index === instructorIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      if (instructorPosition) instructorPosition.textContent = String(instructorIndex + 1);
      window.requestAnimationFrame(updateInstructorHeight);
    }

    function finishInstructorAnimation() {
      window.clearTimeout(instructorAnimationTimer);
      instructorAnimating = false;
      if (instructorPhysicalIndex === 0) {
        instructorPhysicalIndex = instructorSlides.length;
        setInstructorTransform(false, 0);
      } else if (instructorPhysicalIndex === instructorSlides.length + 1) {
        instructorPhysicalIndex = 1;
        setInstructorTransform(false, 0);
      }
    }

    function queueInstructorAnimationFinish() {
      window.clearTimeout(instructorAnimationTimer);
      instructorAnimationTimer = window.setTimeout(finishInstructorAnimation, 560);
    }

    function moveInstructorSlider(step) {
      if (instructorAnimating) return;
      instructorPhysicalIndex += step;
      updateInstructorState(instructorIndex + step);
      instructorAnimating = true;
      setInstructorTransform(true, 0);
      queueInstructorAnimationFinish();
    }

    if (instructorPrev) instructorPrev.addEventListener("click", function () { moveInstructorSlider(-1); });
    if (instructorNext) instructorNext.addEventListener("click", function () { moveInstructorSlider(1); });

    instructorViewport.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      moveInstructorSlider(event.key === "ArrowRight" ? 1 : -1);
    });

    instructorTrack.addEventListener("transitionend", function (event) {
      if (event.target === instructorTrack && event.propertyName === "transform") finishInstructorAnimation();
    });

    instructorViewport.addEventListener("touchstart", function (event) {
      if (instructorAnimating || event.touches.length !== 1) return;
      instructorStartX = event.touches[0].clientX;
      instructorStartY = event.touches[0].clientY;
      instructorDeltaX = 0;
      instructorSwiping = false;
      instructorTrack.classList.add("is-dragging");
    }, { passive: true });

    instructorViewport.addEventListener("touchmove", function (event) {
      if (instructorAnimating || event.touches.length !== 1) return;
      var deltaX = event.touches[0].clientX - instructorStartX;
      var deltaY = event.touches[0].clientY - instructorStartY;
      if (!instructorSwiping && Math.abs(deltaX) < 8) return;
      if (!instructorSwiping && Math.abs(deltaX) <= Math.abs(deltaY) * 1.08) return;
      instructorSwiping = true;
      instructorDeltaX = deltaX;
      event.preventDefault();
      setInstructorTransform(false, deltaX);
    }, { passive: false });

    function finishInstructorSwipe() {
      if (instructorAnimating) return;
      if (!instructorSwiping) {
        setInstructorTransform(true, 0);
        return;
      }
      var threshold = Math.min(70, instructorViewport.clientWidth * .16);
      if (Math.abs(instructorDeltaX) >= threshold) moveInstructorSlider(instructorDeltaX < 0 ? 1 : -1);
      else setInstructorTransform(true, 0);
      instructorSwiping = false;
    }

    instructorViewport.addEventListener("touchend", finishInstructorSwipe, { passive: true });
    instructorViewport.addEventListener("touchcancel", finishInstructorSwipe, { passive: true });

    Array.from(instructorSlider.querySelectorAll("img")).forEach(function (image) {
      if (!image.complete) image.addEventListener("load", updateInstructorHeight, { once: true });
    });
    window.addEventListener("resize", function () {
      window.clearTimeout(instructorResizeTimer);
      instructorResizeTimer = window.setTimeout(updateInstructorHeight, 120);
    });
    updateInstructorState(0);
    setInstructorTransform(false, 0);
  }  var quickNav = document.querySelector(".quick-nav");
  var quickNavHero = document.querySelector(".hero");
  if (quickNav && quickNavHero) {
    var toggleQuickNav = function () {
      var heroRect = quickNavHero.getBoundingClientRect();
      quickNav.classList.toggle("is-visible", heroRect.bottom <= 0);
    };
    toggleQuickNav();
    window.addEventListener("scroll", toggleQuickNav, { passive: true });
    window.addEventListener("resize", toggleQuickNav);
  }

  var mobileFixed = document.querySelector(".mobile-fixed");
  var hero = document.querySelector(".hero");
  if (mobileFixed && hero) {
    var toggleMobileFixed = function () {
      var rect = hero.getBoundingClientRect();
      var threshold = Math.min(window.innerHeight * 0.72, rect.height * 0.72);
      mobileFixed.classList.toggle("is-hidden-on-hero", rect.bottom > threshold);
    };
    toggleMobileFixed();
    window.addEventListener("scroll", toggleMobileFixed, { passive: true });
    window.addEventListener("resize", toggleMobileFixed);
  }

  if (window.location.hash) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView();
      });
    });
  }
})();



