import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { evaluate, format } from 'mathjs';

export default function CalculatorScreen() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string | null>(null);

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

  const doEval = () => {
    try {
      // mathjs expects functions like sin, cos, sqrt etc.
      // Evaluate and format result
      const val = evaluate(expr || '0');
      // format to avoid long floating point tail
      const txt = typeof val === 'number' ? format(val, { precision: 14 }) : String(val);
      setResult(txt);
      setExpr(txt);
    } catch (e) {
      setResult('Error');
    }
  };

  const buttons: Array<Array<{ label: string; value?: string }>> = [
    [
      { label: 'AC', value: 'AC' },
      { label: 'DEL', value: 'DEL' },
      { label: '(', value: '(' },
      { label: ')', value: ')' },
      { label: '÷', value: '/' },
    ],
    [
      { label: 'sin', value: 'sin(' },
      { label: 'cos', value: 'cos(' },
      { label: 'tan', value: 'tan(' },
      { label: '√', value: 'sqrt(' },
      { label: '^', value: '^' },
    ],
    [
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '×', value: '*' },
      { label: 'ln', value: 'log(' },
    ],
    [
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '-', value: '-' },
      { label: 'log', value: 'log10(' },
    ],
    [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '+', value: '+' },
      { label: '%', value: '/100' },
    ],
    [
      { label: '0', value: '0' },
      { label: '.', value: '.' },
      { label: 'ANS', value: 'ANS' },
      { label: '=', value: '=' },
    ],
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.displayContainer}>
        <ScrollView horizontal contentContainerStyle={styles.exprScroll} showsHorizontalScrollIndicator={false}>
          <ThemedText numberOfLines={1} style={styles.exprText}>
            {expr || '0'}
          </ThemedText>
        </ScrollView>
        <ThemedText type="subtitle" style={styles.resultText}>
          {result ?? ''}
        </ThemedText>
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rIdx) => (
          <View key={`r-${rIdx}`} style={styles.row}>
            {row.map((btn, idx) => {
              const onPress = () => {
                if (btn.value === 'AC') return clearAll();
                if (btn.value === 'DEL') return backspace();
                if (btn.value === '=') return doEval();
                if (btn.value === 'ANS') return append(result ?? '0');
                append(btn.value ?? btn.label);
              };

              return (
                <TouchableOpacity key={idx} onPress={onPress} style={styles.button} activeOpacity={0.7}>
                  <ThemedText style={styles.buttonText}>{btn.label}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  displayContainer: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  exprScroll: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minWidth: '100%',
  },
  exprText: {
    fontSize: 28,
  },
  resultText: {
    fontSize: 18,
    marginTop: 6,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 14,
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});
