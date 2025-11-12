// 主要JavaScript功能文件
// 包含页面交互、导航、动画等核心功能

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeNavigation();
    initializeScrollAnimations();
    initializeCounters();
    initializeFAQ();
    initializeParticles();
    
    // 延迟加载图表
    setTimeout(() => {
        initializeCharts();
    }, 1000);
});

// 导航功能
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // 平滑滚动到指定区域
    window.scrollToSection = function(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // 考虑导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // 移除所有活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前活动状态
            this.classList.add('active');
            
            // 滚动到目标区域
            scrollToSection(targetId);
        });
    });
    
    // 滚动时更新导航状态
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 滚动动画
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .highlight-item, .challenge-card, .faq-item');
    
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                // 添加延迟效果
                const delay = Array.from(animatedElements).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = `${delay}ms`;
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察所有动画元素
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// 数字计数动画
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number, .stat-value');
    
    const animateCounter = (element) => {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isMoney = target.includes('万') || target.includes('元');
        const isCount = target.includes('支') || target.includes('个');
        
        let numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        if (isNaN(numericValue)) return;
        
        const duration = 2000; // 2秒
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = numericValue * easeOutQuart;
            
            let displayValue = Math.floor(currentValue);
            if (isPercentage) {
                element.textContent = `${displayValue}%`;
            } else if (isMoney) {
                if (target.includes('万')) {
                    element.textContent = `${displayValue.toLocaleString()}万元`;
                } else {
                    element.textContent = `${displayValue.toLocaleString()}元`;
                }
            } else if (isCount) {
                element.textContent = `${displayValue}${target.includes('支') ? '支' : '个'}`;
            } else {
                element.textContent = displayValue.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // 创建计数器观察器
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// FAQ交互功能
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // 初始状态隐藏答案
        answer.style.display = 'none';
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
        
        question.addEventListener('click', function() {
            const isOpen = answer.style.display === 'block';
            
            // 关闭所有其他FAQ
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherQuestion = otherItem.querySelector('.faq-question');
                otherAnswer.style.display = 'none';
                otherAnswer.style.maxHeight = '0';
                otherQuestion.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)';
            });
            
            if (!isOpen) {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.style.background = 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                
                // 动画完成后移除maxHeight限制
                setTimeout(() => {
                    answer.style.maxHeight = 'none';
                }, 300);
            }
        });
    });
}

// 粒子效果
function initializeParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    heroSection.appendChild(particlesContainer);
    
    // 创建粒子
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置和大小
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 6;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    
    // 动画结束后重新创建粒子
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 6000);
}

// 图表初始化（将在charts.js中详细实现）
function initializeCharts() {
    // 检查是否已加载图表库
    if (typeof Chart !== 'undefined') {
        createTrendChart();
        createTeamChart();
    }
    
    // 检查是否已加载D3.js
    if (typeof d3 !== 'undefined') {
        createTreeDiagram();
    }
}

// 工具函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 添加回到顶部按钮
function addBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, #6366f1, #8b5cf6);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // 点击事件
    backToTopBtn.addEventListener('click', scrollToTop);
}

// 初始化回到顶部按钮
setTimeout(addBackToTopButton, 1000);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 导出函数供其他文件使用
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
