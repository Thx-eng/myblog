import { motion } from 'framer-motion';

export default function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    distance = 30,
    duration = 0.6,
    once = true
}) {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: distance, x: 0 };
            case 'down':
                return { y: -distance, x: 0 };
            case 'left':
                return { y: 0, x: distance };
            case 'right':
                return { y: 0, x: -distance };
            default:
                return { y: distance, x: 0 };
        }
    };

    const variants = {
        hidden: {
            opacity: 0,
            ...getInitialPosition(),
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount: 0.1, margin: "0px 0px -50px 0px" }}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}


