import React from 'react'; // Verifique se esta linha está exatamente assim
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente para renderizar um número específico de estrelas
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={16}
        color="#FFC107"
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

// Componente para um item de avaliação
const ReviewItem = ({ name, rating, comment }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>{name}</Text>
        <StarRating rating={rating} />
        <Text style={styles.ratingText}>{rating} Estrelas</Text>
      </View>
      <Text style={styles.reviewComment}>{comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
  },
  reviewContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  ratingText: {
    marginLeft: 'auto',
    color: '#777',
    fontSize: 14,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
});

export default ReviewItem;