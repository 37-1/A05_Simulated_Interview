/* 交互预留：全部通过 data-* 选择器，避免 ID 冲突 */
(() => {
  'use strict'

  const to = (url) => {
    window.location.href = url
  }

  const signInBtn = document.querySelector('[data-sign-in]')
  const registerLink = document.querySelector('[data-register]')
  const downloadBtn = document.querySelector('[data-download-btn]')

  if (signInBtn) {
    // 移除原有监听器（如果有的话），但由于匿名函数无法移除，我们在下方覆盖了 onclick
    // signInBtn.addEventListener('click', () => {
    //   to('#/signin') 
    // })
  }

  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault()
      to('#/register') // TODO: 替换为真实注册地址
    })
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault()
      // TODO: 触发下载客户端逻辑或跳转
      to('#/download-client')
    })
  }

  // 软件介绍按钮点击交互
  const introBtn = document.querySelector('.hero__intro')
  if (introBtn) {
    introBtn.addEventListener('click', () => {
      const icon = introBtn.querySelector('.hero__intro-icon')
      const section = document.querySelector('.scroll-background')
      
      if (icon && section) {
        // 1. 图标旋转
        icon.classList.add('rotate-down')
        
        // 2. 自定义平滑滚动
        // 计算目标位置
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset
        const startPosition = window.pageYOffset
        const distance = targetPosition - startPosition
        
        // 设置滚动动画参数
        // 立即跳转，无需等待
        const duration = 600 
        let startTime = null

        const ease = (t, b, c, d) => {
          t /= d / 2
          if (t < 1) return c / 2 * t * t + b
          t--
          return -c / 2 * (t * (t - 2) - 1) + b
        }

        const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime
          const timeElapsed = currentTime - startTime
          
          if (timeElapsed < duration) {
            const run = ease(timeElapsed, startPosition, distance, duration)
            window.scrollTo(0, run)
            requestAnimationFrame(animation)
          } else {
            // 动画结束，确保位置精确
            window.scrollTo(0, startPosition + distance)
            // 滚动结束后重置图标
            setTimeout(() => {
              icon.classList.remove('rotate-down')
            }, 500)
          }
        }
        
        // 立即开始滚动，不再延迟
        requestAnimationFrame(animation)
      }
    })
  }

  // Lazy load scroll background
  const lazyLoadBgs = document.querySelectorAll('.scroll-background, .scroll-background-2')
  
  if (lazyLoadBgs.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('lazy-loaded')
          observer.unobserve(entry.target)
        }
      })
    }, { rootMargin: '200px' }) // Start loading slightly before it comes into view

    lazyLoadBgs.forEach(bg => observer.observe(bg))
  }
  // 返回顶部按钮逻辑
  const initBackToTop = () => {
    const mainElement = document.querySelector('main.hero') // 确保选择器正确
    const backToTopBtn = document.getElementById('back-to-top')
    
    if (!mainElement || !backToTopBtn) return

    // 配置参数
    const config = {
      scrollDuration: 300 // 滚动时长 ms，从 800ms 减少到 300ms，速度显著加快
    }

    // 使用 IntersectionObserver 优化性能
    // 需求：main 元素在可视区域内仅剩余30%（即70%已离开视口）时显示按钮
    // 换句话说，当 main 的 70% 滚出视口时。
    // intersectionRatio 表示目标元素可见比例。
    // 当可见比例小于 0.3 时，显示按钮。
    // 但是这里要注意，是“向下滚动，离开视口”。
    // 我们可以观察 main 元素，threshold 设置为 0.3。
    // 当 entry.isIntersecting 为 true 且 ratio < 0.3 时... 不对，isIntersecting 为 true 意味着至少有一部分可见。
    
    // 更准确的做法：
    // 当 main 元素完全在视口内时，ratio 是 1 (如果视口够大) 或 < 1 (视口小)。
    // 我们想要的是：当 main 滚出视口大部分，只剩底部 30% 可见时，或者更少。
    // 这通常意味着 main 的底部接近视口顶部。
    
    // 让我们用 threshold: [0.3]
    // 当可见性穿过 30% 时触发。
    // 如果向下滚动，ratio 从 >0.3 变为 <0.3，此时应该显示按钮。
    // 如果向上滚动，ratio 从 <0.3 变为 >0.3，此时应该隐藏按钮。
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        // entry.boundingClientRect.top < 0 表示 main 的顶部已经滚出视口上方
        // 这是为了区分是“向下滚动导致只剩30%”还是“页面刚加载/在main上方”
        // 不过 main 是首屏元素，top < 0 是肯定的。
        
        if (entry.boundingClientRect.top < 0) {
          if (entry.intersectionRatio <= 0.3) {
             // 剩余可见区域 <= 30%，显示按钮
             backToTopBtn.hidden = false
             requestAnimationFrame(() => {
               backToTopBtn.classList.add('is-visible')
             })
          } else {
             // 剩余可见区域 > 30%，隐藏按钮
             backToTopBtn.classList.remove('is-visible')
          }
        } else {
          // main 还在视口下方或者刚进入，肯定是隐藏按钮
          backToTopBtn.classList.remove('is-visible')
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      root: null, // 视口
      threshold: [0.3] // 监听 30% 可见度变化
    })
    
    observer.observe(mainElement)


    // 平滑滚动回顶部
    const scrollToTop = () => {
      const startPosition = window.pageYOffset
      const targetPosition = 0 
      const distance = targetPosition - startPosition
      const duration = config.scrollDuration
      let startTime = null

      const ease = (t, b, c, d) => {
        t /= d / 2
        if (t < 1) return c / 2 * t * t + b
        t--
        return -c / 2 * (t * (t - 2) - 1) + b
      }

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        
        if (timeElapsed < duration) {
          const run = ease(timeElapsed, startPosition, distance, duration)
          window.scrollTo(0, run)
          requestAnimationFrame(animation)
        } else {
          window.scrollTo(0, targetPosition)
        }
      }

      requestAnimationFrame(animation)
    }

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault()
      scrollToTop()
    })
  }

  initBackToTop()

  // 登录动画逻辑
  const initLoginAnimation = () => {
    const signInBtn = document.querySelector('[data-sign-in]')
    if (!signInBtn) return

    const heroContent = document.querySelector('.hero__content')
    const headerInner = document.querySelector('.header__inner')
    const bg = document.querySelector('.bg')
    const loginOverlay = document.getElementById('login-overlay')
    const loginBackdrop = document.getElementById('login-backdrop')

    // 动画回调
    const onAnimationComplete = (type) => {
      console.log(`Animation ${type} complete`)
      // 可以在这里触发业务逻辑
    }

    const startLoginTransition = () => {
      // 1. 触发滑出动画
      // 左侧元素：heroContent 下的子元素
      // 顶部导航：headerInner 向右
      // 但要求 "div(brand) 不滑动消失"
      // headerInner 包含了 brand 和 nav。
      // 所以不能直接移动 headerInner。需要单独移动 nav。
      
      const nav = headerInner.querySelector('.nav')
      if (nav) {
        nav.classList.add('slide-out-right')
      }

      // heroContent 整体左滑
      // heroContent.classList.add('slide-out-left')
      
      // 分别移动子元素
      const heroTitle = document.querySelector('.hero__title')
      const heroSubtitle = document.querySelector('.hero__subtitle')
      const heroDesc = document.querySelector('.hero__desc')
      const heroActions = document.querySelector('.hero__actions')
      const heroRegister = document.querySelector('.hero__register')

      if (heroTitle) heroTitle.classList.add('slide-out-left')
      if (heroDesc) heroDesc.classList.add('slide-out-left')
      if (heroRegister) heroRegister.classList.add('slide-out-left')
      
      // 向右滑动的元素
      if (heroSubtitle) heroSubtitle.classList.add('slide-out-right')
      if (heroActions) heroActions.classList.add('slide-out-right')
      
      // 背景动画
      bg.classList.add('bg-animate')

      // 2. 350ms 后显示弹窗
      setTimeout(() => {
        loginOverlay.classList.add('is-active')
        onAnimationComplete('enter')
      }, 350)
      
      // 锁定页面滚动
      document.body.style.overflow = 'hidden'
      
      // 添加历史记录状态，以便监听返回
      window.history.pushState({ loginOpen: true }, '')
    }

    const closeLoginTransition = () => {
      // 1. 隐藏弹窗 (150ms)
      loginOverlay.classList.remove('is-active')

      // 2. 150ms 后恢复其他元素
      setTimeout(() => {
        const nav = headerInner.querySelector('.nav')
        if (nav) {
          nav.classList.remove('slide-out-right')
        }
        
        // 恢复子元素状态
        const heroTitle = document.querySelector('.hero__title')
        const heroSubtitle = document.querySelector('.hero__subtitle')
        const heroDesc = document.querySelector('.hero__desc')
        const heroActions = document.querySelector('.hero__actions')
        const heroRegister = document.querySelector('.hero__register')

        if (heroTitle) heroTitle.classList.remove('slide-out-left')
        if (heroDesc) heroDesc.classList.remove('slide-out-left')
        if (heroRegister) heroRegister.classList.remove('slide-out-left')
        if (heroSubtitle) heroSubtitle.classList.remove('slide-out-right')
        if (heroActions) heroActions.classList.remove('slide-out-right')

        // heroContent.classList.remove('slide-out-left')
        
        bg.classList.remove('bg-animate')
        onAnimationComplete('exit')
        
        // 解除页面滚动锁定
        document.body.style.overflow = ''
      }, 150)
    }

    // 绑定事件
    signInBtn.onclick = (e) => { // 使用 onclick 覆盖之前的 addEventListener
      e.preventDefault()
      e.stopPropagation() // 防止冒泡
      startLoginTransition()
    }

    // 点击背景返回
    if (loginBackdrop) {
      loginBackdrop.addEventListener('click', () => {
        // 如果是通过点击背景返回，也应该处理 history
        if (window.history.state && window.history.state.loginOpen) {
          window.history.back() // 这会触发 popstate 事件，从而调用 closeLoginTransition
        } else {
          closeLoginTransition()
        }
      })
    }
    
    // 监听浏览器返回事件 (popstate)
    window.addEventListener('popstate', (e) => {
      // 如果当前是登录弹窗打开状态（即用户按了返回键），则关闭弹窗
      // 或者如果用户之前在登录状态，现在退回了非登录状态
      // 简单的逻辑：只要触发了 popstate，且当前遮罩是显示的，就关闭它
      if (loginOverlay.classList.contains('is-active')) {
        closeLoginTransition()
      }
    })
  }

  initLoginAnimation()

  // 处理登录表单提交
  const initLoginForm = () => {
    const loginForm = document.getElementById('login-form')
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password')

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault() // 阻止默认提交

        const email = emailInput.value
        const password = passwordInput.value
        
        // 简单的客户端验证
        if (!email || !password) {
            alert('请输入用户名和密码')
            return
        }

        try {
          // 修改按钮状态
          const submitBtn = loginForm.querySelector('button[type="submit"]')
          const originalText = submitBtn.innerText
          submitBtn.disabled = true
          submitBtn.innerText = 'Signing in...'

          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          // 恢复按钮状态
          submitBtn.disabled = false
          submitBtn.innerText = originalText

          if (response.ok) {
              const data = await response.json()
              if (data.success && data.redirect) {
                // 登录成功，跳转
                window.location.href = data.redirect
              } else {
                // 登录失败，显示错误
                alert('登录失败: ' + (data.message || '未知错误'))
              }
          } else {
              alert('服务器错误: ' + response.status)
          }
        } catch (error) {
          console.error('Error:', error)
          alert('登录请求出错，请检查网络或联系管理员')
          
          // 恢复按钮状态
          const submitBtn = loginForm.querySelector('button[type="submit"]')
          if (submitBtn) {
              submitBtn.disabled = false
              submitBtn.innerText = 'SIGN IN'
          }
        }
      })
    }
  }

  initLoginForm()
})()