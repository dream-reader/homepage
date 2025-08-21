// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单切换
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
    
    // 表单提交处理
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // 验证必填字段
            if (!data.company || !data.contact || !data.phone || !data.email) {
                showMessage('请填写所有必填字段', 'error');
                return;
            }
            
            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showMessage('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 验证手机号格式
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(data.phone)) {
                showMessage('请输入有效的手机号码', 'error');
                return;
            }
            
            // 模拟表单提交
            submitForm(data);
        });
    }
    
    // 显示消息提示
    function showMessage(message, type) {
        // 移除之前的消息
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建新消息
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        
        // 插入到表单前面
        const form = document.querySelector('.contact-form form');
        form.parentNode.insertBefore(messageDiv, form);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
    
    // 提交表单
    function submitForm(data) {
        // 显示加载状态
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        
        // 模拟API调用延迟
        setTimeout(() => {
            // 这里可以替换为实际的API调用
            console.log('表单数据:', data);
            
            // 显示成功消息
            showMessage('感谢您的咨询！我们会尽快与您联系。', 'success');
            
            // 重置表单
            inquiryForm.reset();
            
            // 恢复按钮状态
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // 滚动到表单顶部
            const formSection = document.querySelector('.contact-form');
            formSection.scrollIntoView({ behavior: 'smooth' });
            
        }, 1500);
    }
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // 向下滚动，隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScrollTop;
        
        // 添加背景透明度
        if (currentScrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // 页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 数字计数动画
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-item h3');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + '+';
            }, 50);
        });
    }
    
    // 当统计部分进入视口时启动动画
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // 表单字段焦点效果
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    // 添加表单字段聚焦样式
    const style = document.createElement('style');
    style.textContent = `
        .form-group.focused label {
            color: #2563eb;
            transform: translateY(-5px);
        }
        
        .form-group.focused input,
        .form-group.focused select,
        .form-group.focused textarea {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    `;
    document.head.appendChild(style);
    
    // 页面加载完成后的初始化
    window.addEventListener('load', function() {
        // 添加页面加载完成的类
        document.body.classList.add('loaded');
        
        // 初始化工具提示（如果有的话）
        initializeTooltips();
    });
    
    // 初始化工具提示
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.position = 'absolute';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.zIndex = '10000';
                
                this.tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this.tooltip) {
                    this.tooltip.remove();
                    this.tooltip = null;
                }
            });
        });
    }
    
    // 添加工具提示样式
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            background: #1e293b;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #1e293b;
        }
    `;
    document.head.appendChild(tooltipStyle);
}); 