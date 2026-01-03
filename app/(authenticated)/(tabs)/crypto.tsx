import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Currency } from '@/interfaces/crypto';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Page = () => {
  const [data, setData] = useState<any>(null);
  const headerHeight = useHeaderHeight();

  const currencies: UseQueryResult<Currency[]> = useQuery({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listing').then(res => res.json()),
  });

  const ids = currencies.data
    ?.map((currency: Currency) => currency.id)
    .join(',');
  console.log('ids', ids);

  const { data: info } = useQuery({
    queryKey: ['info', ids],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then(res => res.json()),
    enabled: !!ids,
  });

  console.log('info', info);

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest Crypto</Text>
      <View style={defaultStyles.block}>
        {currencies?.data?.map((currency: Currency) => {
          console.log({ currency });
          const infoData = info?.[currency.id];
          console.log('infoData', infoData);
          return (
            <Link href={`/crypto/${currency.id}`} key={currency.id} asChild>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'center',
                }}
                key={currency.id}
              >
                <Image
                  source={{ uri: infoData?.logo as string }}
                  style={{ width: 40, height: 40 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: Colors.dark }}>
                    {currency.name}
                  </Text>
                  <Text style={{ color: Colors.gray }}>{currency.symbol}</Text>
                </View>

                <Text style={{ color: Colors.dark }}>
                  ${currency.quote.USD.price.toFixed(2)}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <Ionicons
                    name={
                      currency.quote.USD.percent_change_24h > 0
                        ? 'caret-up'
                        : 'caret-down'
                    }
                    size={20}
                    color={
                      currency.quote.USD.percent_change_24h > 0
                        ? 'green'
                        : 'red'
                    }
                  />
                  <Text
                    style={{
                      color:
                        currency.quote.USD.percent_change_24h > 0
                          ? 'green'
                          : 'red',
                    }}
                  >
                    {currency.quote.USD.percent_change_24h < 0 ? '' : ' '}
                    {currency.quote.USD.percent_change_24h.toFixed(2)}%
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({});
