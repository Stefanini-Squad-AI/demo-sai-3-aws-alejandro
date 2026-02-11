// app/components/creditCard/CreditCardListScreen.tsx (versión con cuentas de prueba)
import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
  Stack,
  Grid,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import {
  Search,
  NavigateBefore,
  NavigateNext,
  Visibility,
  Edit,
  ExitToApp,
  CreditCard,
  Clear,
  Info,
} from '@mui/icons-material';
import { SystemHeader } from '~/components/layout/SystemHeader';
import { LoadingSpinner } from '~/components/ui/LoadingSpinner';
import { useCreditCardList } from '~/hooks/useCreditCardList';
import type { CreditCardFilter } from '~/types/creditCard';

interface CreditCardListScreenProps {
  onExit?: () => void;
}

export function CreditCardListScreen({ onExit }: CreditCardListScreenProps) {
  const theme = useTheme();
  const [searchForm, setSearchForm] = useState<CreditCardFilter>({
    accountId: '',
    cardNumber: '',
  });
  const [showTestData, setShowTestData] = useState(false);

  // Datos de prueba para desarrollo
  const testData = [
    {
      accountId: '12345678901',
      cardNumber: '4532123456789012',
      description: 'Cuenta activa - varias tarjetas',
      expectedResults: 2,
      status: 'ACTIVE'
    },
    {
      accountId: '98765432109',
      cardNumber: '5555666677778888',
      description: 'Cuenta con estado mixto',
      expectedResults: 2,
      status: 'MIXED'
    },
    {
      accountId: '11111111111',
      cardNumber: '4111111111111111',
      description: 'Tarjeta expirada',
      expectedResults: 1,
      status: 'EXPIRED'
    },
    {
      accountId: '22222222222',
      cardNumber: '4222222222222222',
      description: 'Cuenta premium activa',
      expectedResults: 1,
      status: 'ACTIVE'
    },
    {
      accountId: '33333333333',
      cardNumber: '4333333333333333',
      description: 'Cuenta de alto volumen',
      expectedResults: 1,
      status: 'ACTIVE'
    },
    {
      accountId: '44444444444',
      cardNumber: '4444444444444444',
      description: 'Cuenta inactiva',
      expectedResults: 1,
      status: 'INACTIVE'
    },
  ];

  const {
    data,
    loading,
    error,
    currentPage,
    selectedCards,
    validationErrors,
    handleSearch,
    handlePageChange,
    handleCardSelection,
    handleProcessSelection,
    handleExit,
    canGoNext,
    canGoPrev,
    totalPages,
    totalElements,
  } = useCreditCardList({
    onError: (error) => console.error('Credit card list error:', error),
    onSuccess: (data) => console.log('Credit cards loaded:', data.numberOfElements),
  });

  const handleInputChange = useCallback((field: keyof CreditCardFilter) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    
    // Aplicar restricciones de longitud como en el COBOL
    let processedValue = value;
    // if (field === 'accountId' && value.length > 11) {
    //   processedValue = value.slice(0, 11);
    /* } else  */if (field === 'cardNumber' && value.length > 16) {
      processedValue = value.slice(0, 16);
    }
    
    // Solo permitir números
    if (field === 'accountId' || field === 'cardNumber') {
      processedValue = processedValue.replace(/\D/g, '');
    }

    setSearchForm(prev => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchForm);
  }, [searchForm, handleSearch]);

  const handleClearFilters = useCallback(() => {
    setSearchForm({ accountId: '', cardNumber: '' });
  }, []);

  const handleTestDataSelect = useCallback((testItem: typeof testData[0], searchType: 'account' | 'card') => {
    const newSearchForm = {
      accountId: searchType === 'account' ? testItem.accountId : '',
      cardNumber: searchType === 'card' ? testItem.cardNumber : '',
    };
    
    setSearchForm(newSearchForm);
    handleSearch(newSearchForm);
    setShowTestData(false);
  }, [handleSearch]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'F3' || event.key === 'Escape') {
      event.preventDefault();
      onExit ? onExit() : handleExit();
    } else if (event.key === 'F7') {
      event.preventDefault();
      if (canGoPrev) {
        handlePageChange(currentPage - 1);
      }
    } else if (event.key === 'F8') {
      event.preventDefault();
      if (canGoNext) {
        handlePageChange(currentPage + 1);
      }
    } else if (event.key === 'Enter' && Object.keys(selectedCards).length > 0) {
      event.preventDefault();
      handleProcessSelection();
    }
  }, [onExit, handleExit, canGoPrev, canGoNext, currentPage, handlePageChange, selectedCards, handleProcessSelection]);

  const getStatusColor = (status: string) => {
    const normalized = status?.toUpperCase();
    switch (normalized) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'BLOCKED': return 'error';
      case 'EXPIRED': return 'warning';
      case 'MIXED': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const normalized = status?.toUpperCase();
    switch (normalized) {
      case 'ACTIVE': return 'Activo';
      case 'INACTIVE': return 'Inactivo';
      case 'BLOCKED': return 'Bloqueado';
      case 'EXPIRED': return 'Expirado';
      case 'MIXED': return 'Mixto';
      default:
        return status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : '';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box onKeyDown={handleKeyDown} tabIndex={-1}>
        <SystemHeader
          transactionId="CCLI"
          programName="COCRDLIC"
          title="Listar Tarjetas de Crédito"
        />

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard />
              Listar Tarjetas de Crédito
              {totalPages > 0 && (
                <Chip
                  label={`Página ${currentPage}`}
                  size="small"
                  sx={{ 
                    ml: 'auto',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                  }}
                />
              )}
            </Typography>
          </Box>

          {/* Filtros de Búsqueda */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Número de cuenta"
                    value={searchForm.accountId || ''}
                    onChange={handleInputChange('accountId')}
                    error={!!validationErrors.accountId}
                    helperText={validationErrors.accountId || '11 dígitos'}
                    disabled={loading}
                    fullWidth
                    inputProps={{
                      maxLength: 11,
                      pattern: '[0-9]*',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="body2" color="text.secondary">
                            #
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Número de tarjeta de crédito"
                    value={searchForm.cardNumber || ''}
                    onChange={handleInputChange('cardNumber')}
                    error={!!validationErrors.cardNumber}
                    helperText={validationErrors.cardNumber || '16 dígitos'}
                    disabled={loading}
                    fullWidth
                    inputProps={{
                      maxLength: 16,
                      pattern: '[0-9]*',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CreditCard fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <LoadingSpinner size={20} /> : <Search />}
                      sx={{ borderRadius: 2, minWidth: 120 }}
                    >
                      {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleClearFilters}
                      disabled={loading}
                      startIcon={<Clear />}
                      sx={{ borderRadius: 2 }}
                    >
                      Limpiar
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Botón para mostrar datos de prueba (solo en desarrollo) */}
            {import.meta.env.DEV && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Info />}
                  onClick={() => setShowTestData(!showTestData)}
                  sx={{ borderRadius: 2 }}
                >
                  {showTestData ? 'Ocultar datos de prueba' : 'Mostrar datos de prueba'}
                </Button>
              </Box>
            )}

            {/* Lista de datos de prueba */}
            <Collapse in={showTestData}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mt: 2, 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  borderColor: theme.palette.info.main,
                }}
              >
                <Typography variant="subtitle2" gutterBottom color="info.main" fontWeight={600}>
                  Datos de prueba (solo desarrollo)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Haz clic en Número de cuenta o Número de tarjeta para buscar
                </Typography>
                
                <Grid container spacing={1}>
                  {testData.map((item, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Stack spacing={1}>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleTestDataSelect(item, 'account')}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textTransform: 'none',
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  color: 'primary.main',
                                }}
                              >
                                Cuenta: {item.accountId}
                              </Button>
                              <Button
                                variant="text"
                                size="small"
                                onClick={() => handleTestDataSelect(item, 'card')}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textTransform: 'none',
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  color: 'secondary.main',
                                }}
                              >
                                Tarjeta: {item.cardNumber}
                              </Button>
                            </Stack>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Resultados esperados: {item.expectedResults} tarjeta(s)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={3}>
                            <Chip
                              label={getStatusLabel(item.status)}
                              size="small"
                              color={getStatusColor(item.status) as any}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Instrucciones adicionales */}
                <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Consejos de prueba:</strong><br />
                      • Busca por Número de cuenta para ver todas las tarjetas de esa cuenta<br />
                      • Busca por Número de tarjeta para encontrar una tarjeta específica<br />
                      • Deja ambos campos vacíos para ver todas las tarjetas (solo usuarios admin)<br />
                      • Usa F7/F8 para paginar cuando los resultados abarquen varias páginas<br />
                      • Presiona S (Ver) o U (Actualizar) para seleccionar una tarjeta y luego ENTER
                    </Typography>
                </Box>
              </Paper>
            </Collapse>
          </Box>

          {/* Mensajes de Error */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Información de resultados */}
          {data && data.content.length > 0 && (
            <Box sx={{ px: 3, py: 1, bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <Typography variant="body2" color="success.dark" fontWeight={500}>
                {totalElements} registros encontrados • Página {currentPage} de {totalPages}
              </Typography>
            </Box>
          )}

          {/* Tabla de Resultados */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <TableCell width="10%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Seleccionar
                    </Typography>
                  </TableCell>
                  <TableCell width="35%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Número de cuenta
                    </Typography>
                  </TableCell>
                  <TableCell width="40%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Número de tarjeta
                    </Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Activo
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.content.map((card, index) => (
                  <TableRow
                    key={`${card.accountNumber}-${card.cardNumber}`}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => handleCardSelection(index, selectedCards[index] === 'S' ? '' : 'S')}
                          color={selectedCards[index] === 'S' ? 'primary' : 'default'}
                          sx={{
                            border: selectedCards[index] === 'S' ? 2 : 1,
                            borderColor: selectedCards[index] === 'S' ? 'primary.main' : 'divider',
                          }}
                          title="Ver detalles (S)"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleCardSelection(index, selectedCards[index] === 'U' ? '' : 'U')}
                          color={selectedCards[index] === 'U' ? 'secondary' : 'default'}
                          sx={{
                            border: selectedCards[index] === 'U' ? 2 : 1,
                            borderColor: selectedCards[index] === 'U' ? 'secondary.main' : 'divider',
                          }}
                          title="Actualizar tarjeta (U)"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {card.accountNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {card.cardNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(card.cardStatus)}
                        size="small"
                        color={getStatusColor(card.cardStatus) as any}
                        sx={{ minWidth: 32, fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Filas vacías para mantener 7 filas como en el COBOL */}
                {data && data.content.length < 7 && 
                  Array.from({ length: 7 - data.content.length }).map((_, index) => (
                    <TableRow key={`empty-${index}`} sx={{ height: 57 }}>
                      <TableCell colSpan={4}>&nbsp;</TableCell>
                    </TableRow>
                  ))
                }
                
                {/* Mensaje cuando no hay datos */}
                {!loading && (!data || data.content.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        {searchForm.accountId || searchForm.cardNumber 
                          ? 'No se encontraron registros para esta condición de búsqueda'
                          : 'Ingrese los criterios de búsqueda y haga clic en Buscar para encontrar tarjetas de crédito'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Información y Controles */}
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.grey[100], 0.5),
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                {Object.keys(selectedCards).length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Presiona S para ver detalles, U para actualizar cualquier registro
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleProcessSelection}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    ENTER = Continuar
                  </Button>
                )}
              </Grid>

              <Grid item>
                <Stack direction="row" spacing={1} alignItems="center">
                  {totalElements > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {totalElements} registros encontrados
                    </Typography>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<NavigateBefore />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!canGoPrev || loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F7 = atrás
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<NavigateNext />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!canGoNext || loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F8 = adelante
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ExitToApp />}
                    onClick={onExit || handleExit}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    F3 = salir
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
