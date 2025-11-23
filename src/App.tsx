import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, ChevronDown, User, Code, Brain, Bot, Heart, Sparkles, Github, Mail, MessageCircle } from 'lucide-react';
import avatarImage from './assets/images/avatar.jpg';
import emblemImage from './assets/images/emblem.svg';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { getBotResponse } from './services/botService';
import { checkRateLimit, formatResetTime } from './utils/rateLimiter';

export default function App() {
  const [avatarSlideComplete, setAvatarSlideComplete] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'typing1' | 'deleting' | 'typing2' | 'complete'>('typing1');
  const [showCursor, setShowCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Second section states
  const [section2Visible, setSection2Visible] = useState(false);
  const [section2Text, setSection2Text] = useState('');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const section2Ref = useRef<HTMLDivElement>(null);

  // Third section states
  const [section3Visible, setSection3Visible] = useState(false);
  const section3Ref = useRef<HTMLDivElement>(null);

  // Divider states
  const [divider1Visible, setDivider1Visible] = useState(false);
  const [divider2Visible, setDivider2Visible] = useState(false);
  const divider1Ref = useRef<HTMLDivElement>(null);
  const divider2Ref = useRef<HTMLDivElement>(null);

  // Navigation states
  const [currentPage, setCurrentPage] = useState<'主页' | '思考' | '友人' | '关于我'>('主页');
  const pages = ['主页', '思考', '友人', '关于我'] as const;

  // Bot states
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botResponse, setBotResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const text1 = 'Welcome Friend !';
  const text2 = "I'm Starry !";
  const section2FullText = "Who am I ?\nA boy 😃 , A tech guy 😎 , A nerd love Computer Science and MLLM 🤖. A sci-fi lover dreaming of space and starship. Outgoing, passionate，always trying new things , wanting to meet friends with alike will.";

  // Create Emblem icon component
  const EmblemIcon = ({ className }: { className?: string }) => (
    <img src={emblemImage} alt="Emblem" className={className} />
  );

  const icons = [User, Code, Brain, Bot, Heart, Sparkles, EmblemIcon];

  const contactItems = [
    { icon: Github, label: 'mustbeasaltyfish', bgColor: 'bg-gray-900' },
    { icon: Mail, label: 'yukaiwu002@gmail.com', bgColor: 'bg-blue-500' },
    { icon: MessageCircle, label: 'hyvnyf-behhar-1kokVy', bgColor: 'bg-green-500' }
  ];

  useEffect(() => {
    if (!avatarSlideComplete) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    if (currentPhase === 'typing1') {
      if (displayText.length < text1.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(text1.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeoutId = setTimeout(() => {
          setCurrentPhase('deleting');
        }, 1500);
      }
    } else if (currentPhase === 'deleting') {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 70);
      } else {
        timeoutId = setTimeout(() => {
          setCurrentPhase('typing2');
        }, 300);
      }
    } else if (currentPhase === 'typing2') {
      if (displayText.length < text2.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(text2.slice(0, displayText.length + 1));
        }, 100);
      } else {
        setCurrentPhase('complete');
      }
    }

    return () => clearTimeout(timeoutId);
  }, [avatarSlideComplete, displayText, currentPhase]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Scroll observer for section 2
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !section2Visible) {
            setSection2Visible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }

    return () => observer.disconnect();
  }, [section2Visible]);

  // Section 2 typing effect
  useEffect(() => {
    if (!section2Visible) return;

    if (section2Text.length < section2FullText.length) {
      const timeoutId = setTimeout(() => {
        setSection2Text(section2FullText.slice(0, section2Text.length + 1));
      }, 40); // Faster typing speed
      return () => clearTimeout(timeoutId);
    }
  }, [section2Visible, section2Text]);

  // Icon rotation effect
  useEffect(() => {
    if (!section2Visible) return;

    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [section2Visible]);

  // Scroll observer for section 3
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !section3Visible) {
            setSection3Visible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (section3Ref.current) {
      observer.observe(section3Ref.current);
    }

    return () => observer.disconnect();
  }, [section3Visible]);

  // Scroll observer for dividers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === divider1Ref.current && entry.isIntersecting && !divider1Visible) {
            setDivider1Visible(true);
          }
          if (entry.target === divider2Ref.current && entry.isIntersecting && !divider2Visible) {
            setDivider2Visible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (divider1Ref.current) {
      observer.observe(divider1Ref.current);
    }
    if (divider2Ref.current) {
      observer.observe(divider2Ref.current);
    }

    return () => observer.disconnect();
  }, [divider1Visible, divider2Visible]);

  const CurrentIcon = icons[currentIconIndex];
  const isEmblemIcon = CurrentIcon === EmblemIcon;

  // Handle bot submission
  const handleBotSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    // 检查限流
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setErrorMessage(`您的提问次数已达上限，请${formatResetTime(rateLimit.resetTime)}再试`);
      setShowResponse(true);
      return;
    }

    // 清空之前的回答和错误
    setBotResponse('');
    setErrorMessage('');

    // 先隐藏之前的回答（如果有）
    if (showResponse) {
      setShowResponse(false);
      // 等待动画完成后再显示新的
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 开始加载
    setIsLoading(true);
    setShowResponse(true);

    try {
      const result = await getBotResponse(inputValue);

      if (result.error) {
        setErrorMessage(result.error);
        setBotResponse('');
      } else {
        setBotResponse(result.content);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('请求失败，请稍后重试');
      setBotResponse('');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBotSubmit();
    }
  };

  return (
    <div className="bg-background">
      {/* Navigation Bar */}
      {currentPhase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1], delay: 1.5 }}
          className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none md:left-1/2 md:-translate-x-1/2 md:-ml-60 md:w-max md:block md:pointer-events-auto"
        >
          <div className="bg-white rounded-full shadow-lg px-2 py-2 relative pointer-events-auto">
            <div className="flex items-center gap-2 relative">
              {/* Sliding indicator */}
              <motion.div
                className={`absolute h-10 bg-black rounded-full ${isMobile ? 'w-20' : 'w-28'}`}
                initial={false}
                animate={{
                  x: pages.indexOf(currentPage) * ((isMobile ? 80 : 112) + 8)
                }}
                transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
              />
              {/* Navigation items */}
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative z-10 ${isMobile ? 'w-20 text-sm' : 'w-28 text-base'} h-10 rounded-full transition-colors duration-300 flex items-center justify-center`}
                  style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  <span className={`transition-colors duration-300 ${currentPage === page ? 'text-white' : 'text-black'
                    }`}>
                    {page}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Page Content */}
      {currentPage !== '主页' ? (
        <div className="min-h-screen flex items-center justify-center">
          <h1
            className="text-5xl text-gray-600"
            style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
          >
            Under Construction ～
          </h1>
        </div>
      ) : (
        <>
          {/* First Section */}
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-10 md:gap-20">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-2 ml-0 md:ml-32">
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: avatarSlideComplete ? (isMobile ? 0 : 0) : 0
                  }}
                  transition={{
                    duration: 1,
                    ease: [0.7, 0, 0.2, 1] // ease-out curve with faster start
                  }}
                  onAnimationComplete={() => {
                    setTimeout(() => {
                      setAvatarSlideComplete(true);
                    }, 500);
                  }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      x: avatarSlideComplete ? (isMobile ? 0 : -100) : 0,
                      y: avatarSlideComplete ? (isMobile ? -50 : 0) : 0
                    }}
                    transition={{
                      duration: 1,
                      ease: [0.7, 0, 0.2, 1]
                    }}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl">
                      <img
                        src={avatarImage}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Typing Text */}
                {avatarSlideComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
                    className="relative -mt-10 md:mt-0"
                    style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                  >
                    <div className="flex items-center">
                      <span className="text-3xl md:text-5xl tracking-wide text-center md:text-left">
                        {displayText}
                      </span>
                      <motion.span
                        animate={{ opacity: showCursor ? 1 : 0 }}
                        transition={{ duration: 0.1 }}
                        className="inline-block w-1 h-12 bg-blue-500 ml-1"
                        style={{ marginBottom: '-4px' }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Box */}
              {currentPhase === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1], delay: 0.5 }}
                  className="ml-0 md:ml-4 w-full px-4 md:px-0 flex justify-center md:block"
                >
                  <div className="flex flex-col gap-3">
                    <div className="bg-white rounded-full shadow-lg p-1.5 flex items-center gap-1.5">
                      <Input
                        type="text"
                        placeholder="Ask about me any dimension"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 px-3 min-w-[240px] md:min-w-[320px] h-9 text-sm md:text-base"
                      />
                      <Button
                        size="icon"
                        onClick={handleBotSubmit}
                        disabled={isLoading || !inputValue.trim()}
                        className="rounded-full h-9 w-9 bg-black hover:bg-gray-800 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Bot Response Bubble */}
                    <AnimatePresence mode="wait">
                      {showResponse && (
                        <motion.div
                          key="response-bubble"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
                          className="bg-white rounded-2xl shadow-lg p-4 max-w-md"
                          style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                        >
                          {isLoading ? (
                            <div className="text-gray-800 text-base">
                              emm让我想想...
                            </div>
                          ) : errorMessage ? (
                            <div className="text-red-600 text-base">
                              {errorMessage}
                            </div>
                          ) : (
                            <div className="text-gray-800 text-base whitespace-pre-wrap">
                              {botResponse}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Scroll Indicator */}
            {currentPhase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1], delay: 1 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10 -ml-8"
              >
                <div className="bg-black rounded-full p-3 shadow-lg">
                  <ChevronDown className="h-5 w-5 text-white" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Divider 1 - Between Section 1 and 2 */}
          <div
            ref={divider1Ref}
            className="flex items-center justify-center py-20"
          >
            <div className="flex items-center gap-3 w-full max-w-4xl px-8">
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={divider1Visible ? { scale: 1 } : {}}
                transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                className="w-2 h-2 bg-black rounded-full flex-shrink-0"
              />
              {/* Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={divider1Visible ? { width: '100%' } : {}}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1], delay: 0.3 }}
                className="h-0.5 bg-black rounded-full"
              />
            </div>
          </div>

          {/* Second Section */}
          <div
            ref={section2Ref}
            className="min-h-screen flex items-center justify-center px-4 md:px-8 -mt-20 md:-mt-40"
          >
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              {/* Left Side - Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={section2Visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
                className="flex-1 max-w-2xl"
                style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
              >
                <div className="text-xl md:text-3xl text-center md:text-left">
                  {section2Text.split('\n').map((line, index) => (
                    <div key={index}>
                      {line}
                      {index < section2Text.split('\n').length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Rotating Icons */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={section2Visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1], delay: 0.2 }}
                className="flex-shrink-0"
              >
                <motion.div
                  key={currentIconIndex}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
                >
                  {isEmblemIcon ? (
                    <CurrentIcon className="h-32 w-32" />
                  ) : (
                    <CurrentIcon className="h-32 w-32 text-gray-700" strokeWidth={1.5} />
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Divider 2 - Between Section 2 and 3 */}
          <div
            ref={divider2Ref}
            className="flex items-center justify-center py-20"
          >
            <div className="flex items-center gap-3 w-full max-w-4xl px-8">
              {/* Line */}
              <motion.div
                initial={{ width: 0 }}
                animate={divider2Visible ? { width: '100%' } : {}}
                transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1], delay: 0.3 }}
                className="h-0.5 bg-black rounded-full"
                style={{ transformOrigin: 'right' }}
              />
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={divider2Visible ? { scale: 1 } : {}}
                transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                className="w-2 h-2 bg-black rounded-full flex-shrink-0"
              />
            </div>
          </div>

          {/* Third Section */}
          <div
            ref={section3Ref}
            className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 -mt-20 md:-mt-40"
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={section3Visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
              className="text-3xl md:text-5xl mb-10 md:mb-16"
              style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
            >
              Contact me !
            </motion.h2>

            {/* Contact Cards */}
            <div className="flex flex-col gap-6 w-full max-w-2xl">
              {contactItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ width: '64px', borderRadius: '32px' }}
                  animate={section3Visible ? {
                    width: '100%',
                    borderRadius: '32px'
                  } : {}}
                  transition={{
                    duration: 0.8,
                    ease: [0.7, 0, 0.2, 1],
                    delay: index * 0.2 + 0.3
                  }}
                  className="bg-white shadow-lg overflow-hidden"
                >
                  <div className="flex items-center h-16 px-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={section3Visible ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.5,
                        ease: [0.7, 0, 0.2, 1],
                        delay: index * 0.2 + 0.3
                      }}
                      className={`${item.bgColor} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={section3Visible ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        ease: [0.7, 0, 0.2, 1],
                        delay: index * 0.2 + 0.6
                      }}
                      className="ml-6 text-xl text-gray-800"
                      style={{ fontFamily: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
