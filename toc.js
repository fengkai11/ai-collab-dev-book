// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="00_前言.html"><strong aria-hidden="true">1.</strong> 前言：为什么你需要一套 AI 时代的新手开发方法</a></li><li class="chapter-item expanded "><a href="01_为什么很多人用AI开发最后做出来却不好用.html"><strong aria-hidden="true">2.</strong> 第 1 章：为什么很多人用 AI 开发，最后做出来却不好用</a></li><li class="chapter-item expanded "><a href="02_什么是切片式开发.html"><strong aria-hidden="true">3.</strong> 第 2 章：什么是切片式开发，为什么它比“大而全设计”更适合新手</a></li><li class="chapter-item expanded "><a href="03_一页纸产品合同.html"><strong aria-hidden="true">4.</strong> 第 3 章：如何把模糊想法压缩成一页纸产品合同</a></li><li class="chapter-item expanded "><a href="04_页面预览优先.html"><strong aria-hidden="true">5.</strong> 第 4 章：如何先做页面预览，而不是一开始就讲后端</a></li><li class="chapter-item expanded "><a href="05_最小闭环与第一切片.html"><strong aria-hidden="true">6.</strong> 第 5 章：如何识别“最小闭环”，并拆出第一个切片</a></li><li class="chapter-item expanded "><a href="06_如何给GPT下达切片任务.html"><strong aria-hidden="true">7.</strong> 第 6 章：如何给 GPT 下达切片任务，让它不发散</a></li><li class="chapter-item expanded "><a href="07_ClaudeCode_Codex施工任务单.html"><strong aria-hidden="true">8.</strong> 第 7 章：如何给 Claude Code / Codex 写施工任务单</a></li><li class="chapter-item expanded "><a href="08_验收清单.html"><strong aria-hidden="true">9.</strong> 第 8 章：如何用验收清单做非程序员也能执行的验收</a></li><li class="chapter-item expanded "><a href="09_返工单.html"><strong aria-hidden="true">10.</strong> 第 9 章：如何写返工单，判断该返工产品还是返工实现</a></li><li class="chapter-item expanded "><a href="10_个人AI协同开发工作流.html"><strong aria-hidden="true">11.</strong> 第 10 章：如何建立自己的 AI 协同开发工作流</a></li><li class="chapter-item expanded affix "><li class="part-title">附录</li><li class="chapter-item expanded "><a href="附录A_模板包.html"><strong aria-hidden="true">12.</strong> 附录 A：模板包</a></li><li class="chapter-item expanded "><a href="附录B_提示词包.html"><strong aria-hidden="true">13.</strong> 附录 B：提示词包</a></li><li class="chapter-item expanded "><a href="附录C_30天训练计划.html"><strong aria-hidden="true">14.</strong> 附录 C：30 天训练计划</a></li><li class="chapter-item expanded "><a href="附录D_术语解释.html"><strong aria-hidden="true">15.</strong> 附录 D：术语解释</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
