import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
      <div className="relative flex flex-col items-center bg-white p-8 rounded-lg shadow-lg">
        {/* Main loading animation */}
        <div className="flex items-center space-x-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-indigo-600 rounded-full"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-sm font-medium text-gray-600"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading
          </motion.p>
        </motion.div>

        {/* Subtle progress ring */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg border-2 border-indigo-100"
          animate={{
            borderColor: ["rgb(224 231 255)", "rgb(165 180 252)", "rgb(224 231 255)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}

// Optional: Smaller variant for inline loading
export function InlineLoading() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-indigo-600 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Usage examples:
/*
// Full screen loading
{isSubmitting && <Loading />}

// Inline loading (e.g., in a button)
<button disabled={isLoading} className="flex items-center space-x-2">
  {isLoading ? <InlineLoading /> : "Submit Leave Request"}
</button>

// Section loading
<div className="relative min-h-[200px]">
  {isLoading && <InlineLoading />}
  {data && <LeaveCalendar data={data} />}
</div>
*/