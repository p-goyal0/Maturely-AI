/**
 * Report Generation Service
 * Handles PDF report generation with charts and assessment data
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF report from assessment results
 * @param {Object} assessmentResults - Assessment results data
 * @param {HTMLElement} chartElement - Chart container element to capture
 * @param {Object} options - Report options (companyName, date, includeCharts)
 * @returns {Promise<{success: boolean, filename?: string, error?: string}>}
 */
export async function generatePDFReport(assessmentResults, chartElement = null, options = {}) {
  try {
    const {
      companyName = 'Your Organization',
      date = new Date().toLocaleDateString(),
      includeCharts = true,
    } = options;

    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      lines.forEach((line) => {
        checkPageBreak(8);
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });
    };

    // Helper function to add section title
    const addSectionTitle = (title) => {
      checkPageBreak(15);
      yPosition += 5;
      addText(title, 16, true, [0, 0, 0]);
      yPosition += 3;
    };

    // Cover Page
    pdf.setFillColor(70, 205, 198);
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI Readiness Assessment Report', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(companyName, pageWidth / 2, 45, { align: 'center' });
    pdf.text(`Generated on ${date}`, pageWidth / 2, 52, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    yPosition = 70;

    // Executive Summary
    addSectionTitle('Executive Summary');
    const overallScore = assessmentResults?.overall_score || 0;
    const overallMaturity = assessmentResults?.overall_maturity_level || 'Not Available';
    const scorePercentage = Math.round((overallScore / 5) * 100);
    
    addText(
      `Your organization has achieved an overall AI readiness score of ${overallScore.toFixed(2)} out of 5.0 (${scorePercentage}%), ` +
      `placing you at the "${overallMaturity}" maturity level. This report provides a comprehensive analysis ` +
      `of your organization's AI capabilities across seven key pillars.`,
      11,
      false,
      [50, 50, 50]
    );
    yPosition += 5;

    // Overall Score Card
    checkPageBreak(30);
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Overall Score', margin + 5, yPosition + 8);
    
    pdf.setFontSize(20);
    pdf.text(`${overallScore.toFixed(2)} / 5.0`, margin + 5, yPosition + 18);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Maturity Level: ${overallMaturity}`, margin + contentWidth - 60, yPosition + 18);
    
    yPosition += 30;

    // Capture and add charts if available
    if (includeCharts) {
      try {
        addSectionTitle('Visual Analytics');
        
        // Wait longer for charts to fully render
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check available space on current page before adding radar chart
        const availableHeight = pageHeight - yPosition - margin;
        const titleSpace = 20; // Space for title
        const minChartHeight = 120; // Minimum height for chart to be visible
        
        // If not enough space on current page, add new page
        if (availableHeight < minChartHeight + titleSpace) {
          pdf.addPage();
          yPosition = margin;
          // Re-add the section title on new page
          addText('Visual Analytics', 16, true, [0, 0, 0]);
          yPosition += 3;
        }
        
        // Helper function to capture chart
        const captureChart = async (selector, chartName, fallbackSelectors = []) => {
          let element = null;
          
          // Try primary selector
          if (chartElement) {
            element = chartElement.querySelector(selector);
          }
          if (!element) {
            element = document.querySelector(selector);
          }
          
          // Try fallback selectors
          for (const fallback of fallbackSelectors) {
            if (!element) {
              if (chartElement) {
                element = chartElement.querySelector(fallback);
              }
              if (!element) {
                element = document.querySelector(fallback);
              }
            }
          }
          
          // If we found a container with data attribute, find the actual chart inside
          if (element && element.hasAttribute('data-pie-chart')) {
            // Find the PieChart or SVG inside
            const pieChart = element.querySelector('.recharts-wrapper') || 
                           element.querySelector('svg') ||
                           element.querySelector('.recharts-pie');
            if (pieChart) {
              element = pieChart.closest('.recharts-wrapper') || pieChart.parentElement || pieChart;
            }
          }
          
          if (element && element.hasAttribute('data-radar-chart')) {
            // Find the RadarChart or SVG inside
            const radarChart = element.querySelector('.recharts-wrapper') || 
                             element.querySelector('svg') ||
                             element.querySelector('.recharts-radar');
            if (radarChart) {
              element = radarChart.closest('.recharts-wrapper') || radarChart.parentElement || radarChart;
            }
          }
          
          if (!element) {
            console.warn(`${chartName} element not found. Selectors tried: ${selector}, ${fallbackSelectors.join(', ')}`);
            return false;
          }
          
          // Find the best container - prefer recharts-wrapper, then parent div
          let container = element;
          if (element.classList.contains('recharts-wrapper')) {
            container = element;
          } else if (element.querySelector('.recharts-wrapper')) {
            container = element.querySelector('.recharts-wrapper');
          } else if (element.tagName === 'svg') {
            container = element.parentElement || element;
          } else {
            container = element;
          }
          
          // Ensure element is visible and has dimensions
          const rect = container.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            console.warn(`${chartName} element has zero dimensions: ${rect.width}x${rect.height}`);
            return false;
          }
          
          console.log(`Capturing ${chartName} from element:`, container, `Dimensions: ${rect.width}x${rect.height}`);
          
          try {
            const canvas = await html2canvas(container, {
              backgroundColor: '#ffffff',
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true,
              windowWidth: window.innerWidth,
              windowHeight: window.innerHeight,
            });
            
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
              console.warn(`${chartName} canvas is empty`);
              return false;
            }
            
            const imgData = canvas.toDataURL('image/png', 0.95);
            const maxWidth = contentWidth;
            // For radar chart fallback, make it much larger
            const isRadarChart = chartName === 'Radar Chart';
            const imgWidth = isRadarChart ? maxWidth : Math.min(maxWidth, 80);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (imgHeight > 0 && imgHeight < pageHeight - margin * 2) {
              checkPageBreak(imgHeight + 20);
              pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
              yPosition += imgHeight + 15;
              console.log(`${chartName} successfully added to PDF`);
              return true;
            } else {
              console.warn(`${chartName} image dimensions invalid: ${imgWidth}x${imgHeight}`);
            }
          } catch (error) {
            console.error(`Error capturing ${chartName}:`, error);
            return false;
          }
          
          return false;
        };
        
        // Capture Radar Chart - Make it large but fit on current page
        // Calculate available space on current page
        const availableSpace = pageHeight - yPosition - margin - 20; // 20mm for footer
        const radarTitleSpace = 10;
        const maxChartHeight = Math.min(availableSpace - radarTitleSpace, (pageHeight - margin * 2) * 0.85);
        
        addText('Maturity Profile (Radar Chart)', 14, true, [0, 0, 0]);
        yPosition += 5;
        
        // Try to capture the entire radar chart section
        let radarSection = document.querySelector('section[data-radar-section]') ||
                          document.querySelector('[data-radar-chart]')?.closest('section');
        
        if (radarSection) {
          try {
            const canvas = await html2canvas(radarSection, {
              backgroundColor: '#ffffff',
              scale: 3, // Increased scale for better quality
              logging: false,
              useCORS: true,
              allowTaint: true,
              windowWidth: window.innerWidth,
              windowHeight: window.innerHeight,
            });
            
            if (canvas && canvas.width > 0 && canvas.height > 0) {
              const imgData = canvas.toDataURL('image/png', 0.95);
              // Make radar chart use full content width and fit available space on current page
              const maxWidth = contentWidth;
              // Use available space on current page, but ensure it's at least 80% of page height
              const maxHeight = Math.max(maxChartHeight, (pageHeight - margin * 2) * 0.8);
              
              // Calculate dimensions maintaining aspect ratio
              const aspectRatio = canvas.width / canvas.height;
              
              // Start with maximum dimensions and scale down if needed
              let imgWidth = maxWidth; // Full width
              let imgHeight = imgWidth / aspectRatio;
              
              // If height exceeds max, use max height and calculate width
              if (imgHeight > maxHeight) {
                imgHeight = maxHeight;
                imgWidth = imgHeight * aspectRatio;
              }
              
              // Force it to be very large - use maximum available space
              // Ensure it uses at least 98% of content width and 80% of page height
              const minWidth = contentWidth * 0.98; // At least 98% of content width
              const minHeight = (pageHeight - margin * 2) * 0.8; // At least 80% of page height
              
              // Prioritize making it as large as possible
              if (imgWidth < minWidth) {
                imgWidth = minWidth;
                imgHeight = imgWidth / aspectRatio;
                // If this makes height too large, use max height instead
                if (imgHeight > maxHeight) {
                  imgHeight = maxHeight;
                  imgWidth = imgHeight * aspectRatio;
                }
              }
              
              if (imgHeight < minHeight) {
                imgHeight = minHeight;
                imgWidth = imgHeight * aspectRatio;
                // If this makes width too large, use max width instead
                if (imgWidth > maxWidth) {
                  imgWidth = maxWidth;
                  imgHeight = imgWidth / aspectRatio;
                }
              }
              
              // Final dimensions - use maximum available space
              const finalWidth = Math.min(imgWidth, maxWidth);
              const finalHeight = Math.min(imgHeight, maxHeight);
              
              if (finalHeight > 0 && finalHeight < pageHeight - margin * 2) {
                checkPageBreak(finalHeight + 20);
                pdf.addImage(imgData, 'PNG', margin, yPosition, finalWidth, finalHeight);
                yPosition += finalHeight + 15;
                console.log(`Radar chart successfully added to PDF (very large size: ${finalWidth.toFixed(1)}mm x ${finalHeight.toFixed(1)}mm)`);
              }
            }
          } catch (error) {
            console.warn('Error capturing radar chart section:', error);
            // Fallback to just the radar chart
            const radarCaptured = await captureChart(
              '[data-radar-chart]',
              'Radar Chart',
              [
                'section[data-radar-section] .recharts-wrapper',
                '.recharts-radar-chart',
                'section[data-radar-section] svg',
                'div:has(.recharts-radar-chart)'
              ]
            );
            
            if (!radarCaptured) {
              addText('Radar chart could not be captured.', 10, false, [150, 150, 150]);
              yPosition += 5;
            }
          }
        } else {
          // Fallback to just the radar chart
          const radarCaptured = await captureChart(
            '[data-radar-chart]',
            'Radar Chart',
            [
              'section[data-radar-section] .recharts-wrapper',
              '.recharts-radar-chart',
              'section[data-radar-section] svg',
              'div:has(.recharts-radar-chart)'
            ]
          );
          
          if (!radarCaptured) {
            addText('Radar chart could not be captured.', 10, false, [150, 150, 150]);
            yPosition += 5;
          }
        }
        
      } catch (chartError) {
        console.error('Error capturing charts:', chartError);
        addText('Note: Charts could not be included in this report.', 10, false, [150, 150, 150]);
        yPosition += 5;
      }
    }

    // Pillar Scores
    if (assessmentResults?.pillar_results && assessmentResults.pillar_results.length > 0) {
      addSectionTitle('Pillar-wise Performance');
      
      const pillarShortNames = {
        "Strategic Value & Governance": "Strategy & Governance",
        "Workforce Skillset & Organization Structure": "Organization & Workforce",
        "Technology & Data": "Data & Technology",
        "Resilience, Performance & Impact": "Performance & Impact",
        "Ethics, Trust & Responsible AI": "Trust, Ethics & Responsible AI",
        "Compliance, Security & Risk": "Security & Risk",
        "Operations & Implementation": "Operations & Implementation",
      };

      const sortedPillars = [...assessmentResults.pillar_results].sort(
        (a, b) => a.pillar_order - b.pillar_order
      );

      sortedPillars.forEach((pillar, index) => {
        checkPageBreak(25);
        
        const pillarName = pillarShortNames[pillar.pillar_name] || pillar.pillar_name;
        const score = pillar.average_score.toFixed(2);
        const maturity = pillar.maturity_level || 'N/A';
        
        // Pillar card
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'F');
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(pillarName, margin + 5, yPosition + 8);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Score: ${score} / 5.0`, margin + 5, yPosition + 15);
        pdf.text(`Maturity: ${maturity}`, margin + contentWidth - 50, yPosition + 15);
        
        yPosition += 25;
      });
    }

    // Key Insights
    addSectionTitle('Key Insights');
    addText(
      'This assessment evaluates your organization across seven critical pillars of AI maturity. ' +
      'Use the detailed scores and recommendations to identify areas for improvement and prioritize ' +
      'your AI transformation initiatives.',
      11,
      false,
      [50, 50, 50]
    );
    yPosition += 10;

    // Footer on each page
    const addFooter = () => {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${pageCount} | AI Readiness Assessment Report - ${companyName}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    };

    addFooter();

    // Generate filename
    const filename = `AI_Readiness_Report_${companyName.replace(/\s+/g, '_')}_${date.replace(/\//g, '_')}.pdf`;

    // Save PDF
    pdf.save(filename);

    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate PDF report',
    };
  }
}
