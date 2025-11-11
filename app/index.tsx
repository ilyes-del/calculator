import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { evaluate, format } from 'mathjs';

export default function CalculatorScreen() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('rad');

  const append = (s: string) => {
    setExpr((p) => (p === '0' ? s : p + s));
    setResult(null);
  };

  const backspace = () => {
    setExpr((p) => (p.length > 0 ? p.slice(0, -1) : ''));
    setResult(null);
  };

  const clearAll = () => {
    setExpr('');
    setResult(null);
  };

  const toggleSign = () => {
    setExpr((p) => {
      if (!p) return '-';
      if (p.startsWith('-')) return p.slice(1);
      return '-' + p;
    });
  };

  const doEval = () => {
    try {
      let evalExpr = expr || '0';
      
      // Convert degrees to radians if in deg mode
      if (angleMode === 'deg') {
        evalExpr = evalExpr
          .replace(/sin\(/g, 'sin((pi/180)*')
          .replace(/cos\(/g, 'cos((pi/180)*')
          .replace(/tan\(/g, 'tan((pi/180)*')
          .replace(/asin\(/g, '(180/pi)*asin(')
          .replace(/acos\(/g, '(180/pi)*acos(')
          .replace(/atan\(/g, '(180/pi)*atan(');
      }
      
      // Handle special functions
      evalExpr = evalExpr
        .replace(/acsc\(/g, 'asin(1/')
        .replace(/asec\(/g, 'acos(1/')
        .replace(/acot\(/g, 'atan(1/')
        .replace(/nthRoot\(/g, 'nthRoot(')
        .replace(/factorial\(/g, 'factorial(')
        .replace(/per\(/g, 'permutations(')
        .replace(/comb\(/g, 'combinations(');
      
      const val = evaluate(evalExpr);
      const txt = typeof val === 'number' ? format(val, { precision: 14 }) : String(val);
      setResult(txt);
      setExpr(txt);
    } catch (e) {
      setResult('Error');
    }
  };

  const buttons: Array<Array<{ label: string; value?: string }>> = [
    [
      { label: 'sin x', value: 'sin(' },
      { label: 'cos x', value: 'cos(' },
      { label: 'tan x', value: 'tan(' },
      { label: '1/x', value: '1/(' },
      { label: '|x|', value: 'abs(' },
      { label: 'xⁿ', value: '^' },
      { label: '+/-', value: '+/-' },
    ],
    [
      { label: 'sin⁻¹ x', value: 'asin(' },
      { label: 'log', value: 'log10(' },
      { label: 'nₓ/ᵧ', value: 'nthRoot(' },
      { label: '(', value: '(' },
      { label: ')', value: ')' },
      { label: 'csc x', value: '1/sin(' },
      { label: 'sec x', value: '1/cos(' },
    ],
    [
      { label: 'cos⁻¹ x', value: 'acos(' },
      { label: 'x!', value: 'factorial(' },
      { label: 'AC', value: 'AC' },
      { label: 'DEL', value: 'DEL' },
      { label: '%', value: '%' },
      { label: 'cot x', value: '1/tan(' },
      { label: '÷', value: '/' },
    ],
    [
      { label: 'tan⁻¹ x', value: 'atan(' },
      { label: 'x²', value: '^2' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: 'csc⁻¹', value: 'acsc(' },
      { label: 'x', value: '*' },
    ],
    [
      { label: 'sec⁻¹', value: 'asec(' },
      { label: '√', value: 'sqrt(' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: 'cot⁻¹', value: 'acot(' },
      { label: '-', value: '-' },
    ],
    [
      { label: 'π', value: 'pi' },
      { label: 'e', value: 'e' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: 'per', value: 'per' },
      { label: '+', value: '+' },
    ],
    [
      { label: 'comb', value: 'comb' },
      { label: '00', value: '00' },
      { label: '0', value: '0' },
      { label: '.', value: '.' },
      { label: '=', value: '=' },
      { label: '=', value: '=' },
      { label: '=', value: '=' },
    ],
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ThemedView style={styles.container}>
        {/* Angle Mode Toggle - At Top */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, angleMode === 'rad' && styles.modeButtonActive]}
            onPress={() => setAngleMode('rad')}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.modeButtonText, angleMode === 'rad' && styles.modeButtonTextActive]}>
              RAD
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, angleMode === 'deg' && styles.modeButtonActive]}
            onPress={() => setAngleMode('deg')}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.modeButtonText, angleMode === 'deg' && styles.modeButtonTextActive]}>
              DEG
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.displayContainer}>
          <ScrollView 
            horizontal 
            contentContainerStyle={styles.exprScroll} 
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            <ThemedText style={styles.exprText} numberOfLines={2} adjustsFontSizeToFit>
              {expr || '0'}
            </ThemedText>
          </ScrollView>
          {result && (
            <View style={styles.resultContainer}>
              <ThemedText style={styles.resultLabel}>= </ThemedText>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                bounces={false}
                style={styles.resultScroll}
              >
                <ThemedText style={styles.resultText} numberOfLines={1}>
                  {result}
                </ThemedText>
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>
        {buttons.map((row, rIdx) => (
          <View key={`r-${rIdx}`} style={styles.row}>
            {row.map((btn, idx) => {
              const onPress = () => {
                if (btn.value === 'AC') return clearAll();
                if (btn.value === 'DEL') return backspace();
                if (btn.value === '=') return doEval();
                if (btn.value === '+/-') return toggleSign();
                if (btn.value === '^2') {
                  append('^2');
                  return;
                }
                if (btn.value === '%') {
                  append('/100');
                  return;
                }
                if (btn.value === 'per') {
                  append('permutations(');
                  return;
                }
                if (btn.value === 'comb') {
                  append('combinations(');
                  return;
                }
                append(btn.value ?? btn.label);
              };

              return (
                <TouchableOpacity 
                  key={idx} 
                  onPress={onPress} 
                  style={styles.button} 
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.buttonText}>{btn.label}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingTop: 8,
    marginBottom: 8,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(128, 128, 128, 0.3)',
    minWidth: 60,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderColor: 'rgba(76, 175, 80, 0.6)',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  modeButtonTextActive: {
    opacity: 1,
    fontWeight: '700',
  },
  displayContainer: {
    minHeight: 160,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  exprScroll: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
  exprText: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'right',
    flexShrink: 1,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    width: '100%',
  },
  resultLabel: {
    fontSize: 20,
    opacity: 0.5,
    marginRight: 6,
  },
  resultScroll: {
    flex: 1,
  },
  resultText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#4CAF50',
    textAlign: 'right',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  activeButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
