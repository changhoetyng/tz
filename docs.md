# Documentation

## Your Approach & Decisions

### Notes
- Data fetching is handled using React Query, which provides:
  - Built-in loading and error state management
  - Automatic UI updates during data loading or error conditions
- Loading indicators and error messages are displayed to ensure a responsive and user-friendly experience
- API logic is separated into custom hooks and configuration files for better maintainability and clarity

### Additions
- The year range picker component allows users to select a start and end year for filtering the data shown in the charts. The picker ensures that the start year cannot be after the end year, and vice versa, providing a user-friendly way to select a valid year range for analysis.
- Added a comparison feature in the chart tooltips: when the user hovers over a chart, the tooltip now displays both the main dataset's values and, if a comparison scenario is selected, the corresponding values from the comparison dataset side by side. This makes it easy for users to directly compare data points between scenarios while interacting with the chart.

### Future Improvements
1. **Dynamic Year Range Picker**:  
   Instead of hard-coding the minimum and maximum years for the year range picker, I would use the dataset's metadata (e.g., `metadata.years`) to dynamically set the available year range. This would make the UI more robust and adaptable to different datasets, and prevent users from selecting years outside the actual data range.

2. **Performance Consideration**:  
     I notice occasional performance lags, especially when switching between large datasets or adjusting the year range rapidly. If I had more time, I would investigate the root causes—such as unnecessary re-renders, expensive data transformations, or inefficient state updates—and optimize the data flow and component rendering to ensure a smoother user experience.

