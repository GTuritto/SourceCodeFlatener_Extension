/**
 * Sample Java application that demonstrates various language features
 */
package com.example.demo;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    private static final String VERSION = "1.0.0";
    
    /**
     * Application entry point
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        System.out.println("Application starting...");
        System.out.println("Version: " + VERSION);
        System.out.println("Current time: " + getCurrentTime());
        
        // Create a list of items
        List<String> items = new ArrayList<>();
        items.add("Apple");
        items.add("Banana");
        items.add("Cherry");
        items.add("Date");
        items.add("Elderberry");
        
        // Process list using streams
        System.out.println("\nProcessing items...");
        List<String> processedItems = items.stream()
                .filter(item -> item.length() > 5)
                .map(String::toUpperCase)
                .collect(Collectors.toList());
        
        // Print results
        System.out.println("Processed items:");
        processedItems.forEach(item -> System.out.println("- " + item));
        
        // Calculate some numbers
        int result = Calculator.add(5, 7);
        System.out.println("\nCalculation result: " + result);
        
        System.out.println("Application completed.");
    }
    
    /**
     * Gets the current time formatted as a string
     * @return Formatted current time
     */
    private static String getCurrentTime() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return now.format(formatter);
    }
    
    /**
     * Inner calculator class for demonstration
     */
    static class Calculator {
        /**
         * Adds two numbers
         * @param a First number
         * @param b Second number
         * @return Sum of a and b
         */
        public static int add(int a, int b) {
            return a + b;
        }
        
        /**
         * Subtracts second number from first
         * @param a First number
         * @param b Second number
         * @return Difference of a and b
         */
        public static int subtract(int a, int b) {
            return a - b;
        }
    }
}
